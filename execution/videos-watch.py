#!/usr/bin/env python3
"""videos-watch.py: Holly's YouTube channel -> crystalseedtarot.com/videos, every night.

Built 2026-09-22 after the September 2026 set sat on YouTube for six days without
reaching the site. The run reads the channel with yt-dlp, finds videos the site does
not have, places each one where it belongs on /videos (a choose-your-own-adventure
set, a lesson, a season reading, card care), appends it to lib/youtube-videos.json,
type-checks, builds, commits, pushes to main (Vercel deploys from GitHub), waits for
the live page to carry the new ids, runs the production smoke, and tells Russ and Kit
what happened. Anything the title rules cannot place goes to a review pile with Jev's
suggestion (shadow only: a Jev answer never ships anything) and a ping that carries
the one-line fix.

    videos-watch.py                 the nightly run (silent when nothing is new)
    videos-watch.py --dry-run       read the channel, print the plan, change nothing, send nothing
    videos-watch.py --replay        run the title rules over every video already in the JSON
    videos-watch.py --ping-test     send one test ping (positive control for the channels)
    videos-watch.py --add ID --kind lesson|season|care|welcome|intro|reading
                    [--topic money|general|love] [--choice 1|2|3] [--round YYYY-MM] [--blurb "..."]
                                    Kit's answer to a review-pile item: place it and ship it
    videos-watch.py --ignore ID [--why "..."]     never ask about this id again
    videos-watch.py --no-push       everything but the push and the live check (local test)
    videos-watch.py --repo PATH     work on another checkout (tests)

Kill switch: touch ~/.claude-os/crystal-seed-videos/OFF
State:       ~/.claude-os/crystal-seed-videos/state.json
Log:         ~/.claude-os/crystal-seed-videos/watch.log
Schedule:    ~/Library/LaunchAgents/com.studio.crystal-seed-videos-watch.plist
Exit codes:  0 ok (nothing new counts), 1 a step failed (the fleet flags it), 3 kill switch or lock held

No secrets live in this file (the repo is public): the Telegram token comes from
~/.claude/channels/telegram/.env, everything else from ~/.secrets, read at run time.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path

HOME = Path.home()
DEFAULT_REPO = Path(__file__).resolve().parents[1]
# VIDEOS_WATCH_LANE points the state, log and lock somewhere else (end-to-end tests on a scratch clone)
LANE = Path(os.environ.get("VIDEOS_WATCH_LANE") or (HOME / ".claude-os" / "crystal-seed-videos"))
STATE = LANE / "state.json"
LOG = LANE / "watch.log"
OFF = LANE / "OFF"
LOCK = LANE / "lock"
SECRETS = HOME / ".secrets"
TELEGRAM_ENV = HOME / ".claude" / "channels" / "telegram" / ".env"
ASKS_FILE = HOME / "Documents" / "Obsidian Notes" / "_Inbox" / "00-WHAT-NEEDS-YOU.md"
JEV_CARD = HOME / ".claude-os" / "jevshape" / "cards" / "crystal-seed-video-intake.v2.json"
JEV_OFF = HOME / ".claude" / "harness" / "OFF-jevshape"
JEV_SHADOW = HOME / ".claude-os" / "logs" / "jev-shadow.jsonl"

SITE = "https://crystalseedtarot.com"
VERCEL_PROJECT = "crystal-seed-tarot-dot-com"
GIT_REMOTE_MATCH = "washyaderner/crystal-seed-tarot-dot-com"
YTDLP = shutil.which("yt-dlp") or "/opt/homebrew/bin/yt-dlp"
PATH_ENV = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
LIVE_WAIT_S = 15 * 60
LIVE_POLL_S = 30
REPING_DAYS = 3
MAX_JEV_CALLS = 20

TOPIC_ORDER = ["money", "general", "love"]
TOPIC_LABEL = {"money": "Money & Career", "love": "Love & Relationships", "general": "General"}
INTRO_BLURB = {
    "money": "Holly lays out three money and career readings. Pick the one that pulls at you.",
    "love": "Holly lays out three love readings. Pick the one that pulls at you.",
    "general": "Holly lays out three readings with no set topic. Pick the one that pulls at you.",
}
KINDS = ("welcome", "intro", "reading", "lesson", "season", "care")
MONTHS = {"jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, "jul": 7, "aug": 8, "sep": 9, "sept": 9,
          "oct": 10, "nov": 11, "dec": 12}
MONTH_LABEL = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
               "October", "November", "December"]
MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

# ---- the title rules (code, not a model). --replay proves them on every video already placed.
CYOA_RX = re.compile(r"interactive|pick[ -]a[ -]card|pick your reading|choose your (?:own )?(?:reading|adventure)", re.I)
INTRO_RX = re.compile(r"\bintro\b|\bintroduction\b", re.I)
CHOICE_RX = re.compile(r"#\s*([123])\b|\breading\s*([123])\b|\b(?:option|choice|pile|path)\s*([123])\b", re.I)
TOPIC_RX = {
    "money": re.compile(r"money|career|financ|\bwork\b|\bjob\b|business|abundance|wealth", re.I),
    "love": re.compile(r"\blove\b|relationship|romance|romantic|\bheart\b|partner|soulmate|twin flame", re.I),
    "general": re.compile(r"\bgeneral\b", re.I),
}
KIND_RX = {
    "welcome": re.compile(r"crystal seed tarot introduction|channel intro|\bwelcome\b|meet holly|who i am|about me|my story", re.I),
    "season": re.compile(r"\bseason\b|\baries\b|taurus|gemini|\bcancer\b|\bleo\b|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces|full moon|new moon|eclipse|solstice|equinox|retrograde", re.I),
    "lesson": re.compile(r"\blesson\b|\bsuit\b|\bwands\b|\bcups\b|\bswords\b|\bpentacles\b|arcana|court card|how to read|tarot 101|beginner|\bmeaning|explained|\blearn\b|isn't as bad|tarot basics|\bthe fool\b|\bthe magician\b|high priestess|the empress|the emperor|hierophant|the lovers|the chariot|\bstrength\b|the hermit|wheel of fortune|\bjustice\b|hanged man|\bdeath\b|temperance|the devil|the tower|the star|the moon|the sun|judgement|the world", re.I),
    "care": re.compile(r"\bclean(?:ing|se|sing)?\b|\bstor(?:e|ing|age)\b|caring for|card care|take care of|\bshuffl", re.I),
}
MONTH_RX = re.compile(r"\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(20\d{2})\b", re.I)

PT = timezone(timedelta(hours=-7))


def now_pt() -> str:
    return datetime.now(PT).strftime("%a %b %-d, %-I:%M %p PT")


def log(msg: str) -> None:
    LANE.mkdir(parents=True, exist_ok=True)
    line = f"{datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')} {msg}"
    with LOG.open("a") as fh:
        fh.write(line + "\n")
    print(line, flush=True)


def read_env_file(path: Path) -> dict:
    out = {}
    try:
        for line in path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            if line.startswith("export "):
                line = line[7:]
            k, v = line.split("=", 1)
            out[k.strip()] = v.strip().strip('"').strip("'")
    except OSError:
        pass
    return out


SECRET = read_env_file(SECRETS)
TG = read_env_file(TELEGRAM_ENV)


def run(cmd: list, cwd: Path | None = None, timeout: int = 600, check: bool = True) -> subprocess.CompletedProcess:
    env = dict(os.environ, PATH=PATH_ENV + ":" + os.environ.get("PATH", ""), CI="1", NEXT_TELEMETRY_DISABLED="1")
    r = subprocess.run(cmd, cwd=str(cwd) if cwd else None, capture_output=True, text=True, timeout=timeout, env=env)
    if check and r.returncode != 0:
        raise RuntimeError(f"{' '.join(str(c) for c in cmd[:3])} exited {r.returncode}: {(r.stderr or r.stdout)[-800:]}")
    return r


# ---------------------------------------------------------------- state
def load_state() -> dict:
    try:
        return json.loads(STATE.read_text())
    except (OSError, ValueError):
        return {}


def save_state(st: dict) -> None:
    LANE.mkdir(parents=True, exist_ok=True)
    tmp = STATE.with_suffix(".tmp")
    tmp.write_text(json.dumps(st, indent=1) + "\n")
    os.replace(tmp, STATE)


# ---------------------------------------------------------------- data file
def load_data(repo: Path) -> dict:
    return json.loads((repo / "lib" / "youtube-videos.json").read_text())


def save_data(repo: Path, data: dict) -> None:
    (repo / "lib" / "youtube-videos.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def validate(data: dict) -> list[str]:
    """The data gate. The TS module repeats the same checks at build time; this one runs first."""
    problems = []
    rounds = data.get("rounds") or []
    keys = [r.get("key") for r in rounds]
    for r in rounds:
        if not re.fullmatch(r"\d{4}-\d{2}", str(r.get("key", ""))) or not r.get("label") or not r.get("short"):
            problems.append(f"round {r}: needs key YYYY-MM, label, short")
    if len(keys) != len(set(keys)):
        problems.append("duplicate round keys")
    if keys != sorted(keys, reverse=True):
        problems.append("rounds are not newest first")
    seen = set()
    sets: dict[tuple, dict] = {}
    for v in data.get("videos") or []:
        w = f"{v.get('id')}: "
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", str(v.get("id", ""))):
            problems.append(w + "bad id")
        if v.get("id") in seen:
            problems.append(w + "duplicate id")
        seen.add(v.get("id"))
        if not v.get("title"):
            problems.append(w + "missing title")
        if v.get("kind") not in KINDS:
            problems.append(w + f"unknown kind {v.get('kind')}")
        if not isinstance(v.get("duration"), int) or v["duration"] <= 0:
            problems.append(w + "duration must be whole seconds")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(v.get("published", ""))):
            problems.append(w + "published must be YYYY-MM-DD")
        if not isinstance(v.get("blurb"), str) or not v["blurb"].strip():
            problems.append(w + "missing blurb")
        if v.get("kind") in ("intro", "reading"):
            if v.get("topic") not in TOPIC_ORDER:
                problems.append(w + f"topic {v.get('topic')} is not one of {TOPIC_ORDER}")
            if v.get("round") not in keys:
                problems.append(w + f"round {v.get('round')} is not in rounds")
            s = sets.setdefault((v.get("topic"), v.get("round")), {"intro": 0, 1: 0, 2: 0, 3: 0})
            if v["kind"] == "intro":
                s["intro"] += 1
            elif v.get("choice") in (1, 2, 3):
                s[v["choice"]] += 1
            else:
                problems.append(w + "reading needs choice 1, 2 or 3")
        elif v.get("choice") is not None or v.get("topic") is not None or v.get("round") is not None:
            problems.append(w + "topic, round and choice belong to intros and readings only")
    for (topic, rnd), s in sets.items():
        if any(n != 1 for n in s.values()):
            problems.append(f"set {topic}/{rnd} is not exactly one intro plus readings 1, 2, 3: {s}")
    return problems


# ---------------------------------------------------------------- YouTube
def channel_listing(data: dict) -> list[dict]:
    handle = data["channel"]["handle"]
    url = f"https://www.youtube.com/{handle}/videos"
    last = None
    for attempt in (1, 2):
        try:
            r = run([YTDLP, "--flat-playlist", "-J", url], timeout=240)
            d = json.loads(r.stdout)
            entries = [{"id": e.get("id"), "title": e.get("title"), "duration": e.get("duration")}
                       for e in d.get("entries") or [] if e.get("id")]
            if not entries:
                raise RuntimeError("yt-dlp returned zero entries")
            return entries
        except (RuntimeError, ValueError, subprocess.TimeoutExpired) as e:
            last = e
            log(f"channel listing attempt {attempt} failed: {str(e)[:300]}")
            if attempt == 1:
                time.sleep(60)
    raise RuntimeError(f"channel listing failed twice: {last}")


def rss_listing(data: dict) -> list[dict]:
    """Detection-only fallback (no durations): YouTube's public feed, the newest 15 uploads."""
    url = f"https://www.youtube.com/feeds/videos.xml?channel_id={data['channel']['id']}"
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "curl/8.7.1"}), timeout=30) as r:
        root = ET.fromstring(r.read())
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    out = []
    for e in root.findall("a:entry", ns):
        vid = e.findtext("yt:videoId", default="", namespaces=ns)
        if vid:
            out.append({"id": vid, "title": e.findtext("a:title", default="", namespaces=ns),
                        "published": (e.findtext("a:published", default="", namespaces=ns) or "")[:10]})
    return out


def video_meta(vid: str) -> dict:
    r = run([YTDLP, "-J", "--skip-download", f"https://www.youtube.com/watch?v={vid}"], timeout=180)
    d = json.loads(r.stdout)
    up = str(d.get("upload_date") or "")
    return {
        "id": d.get("id") or vid,
        "title": (d.get("title") or "").strip(),
        "duration": int(round(d.get("duration") or 0)),
        "published": f"{up[:4]}-{up[4:6]}-{up[6:8]}" if len(up) == 8 else "",
        "description": d.get("description") or "",
        "availability": d.get("availability"),
        "live_status": d.get("live_status"),
    }


# ---------------------------------------------------------------- classification (rules)
def round_from(title: str, published: str) -> tuple[str, str, str]:
    m = MONTH_RX.search(title)
    if m:
        mon = MONTHS[m.group(1).lower()[:4] if m.group(1).lower().startswith("sept") else m.group(1).lower()[:3]]
        year = int(m.group(2))
    else:
        year, mon = int(published[:4]), int(published[5:7])
    return f"{year}-{mon:02d}", f"{MONTH_LABEL[mon - 1]} {year}", f"{MONTH_SHORT[mon - 1]} {year}"


def classify(meta: dict) -> dict:
    """Title rules. Returns {kind, topic, choice, round, round_label, round_short, review: [reasons]}."""
    t = meta["title"]
    out: dict = {"kind": None, "topic": None, "choice": None, "round": None, "round_label": None,
                 "round_short": None, "review": []}
    if meta.get("live_status") not in (None, "not_live", "was_live"):
        out["review"].append(f"live_status {meta.get('live_status')}")
    if CYOA_RX.search(t):
        topics = [k for k, rx in TOPIC_RX.items() if rx.search(t)]
        if len(topics) == 1:
            out["topic"] = topics[0]
        elif not topics:
            out["review"].append("no path word (money, love, general) in the title")
        else:
            out["review"].append(f"more than one path word in the title: {topics}")
        out["round"], out["round_label"], out["round_short"] = round_from(t, meta.get("published") or "1970-01-01")
        if INTRO_RX.search(t):
            out["kind"] = "intro"
            if meta["duration"] > 360:
                out["review"].append(f"intro longer than 6 min ({meta['duration']} s)")
        else:
            m = CHOICE_RX.search(t)
            if m:
                out["kind"] = "reading"
                out["choice"] = int(next(g for g in m.groups() if g))
                if meta["duration"] < 180:
                    out["review"].append(f"reading shorter than 3 min ({meta['duration']} s)")
            else:
                out["review"].append("interactive video with no intro word and no reading number")
    else:
        kinds = [k for k, rx in KIND_RX.items() if rx.search(t)]
        if len(kinds) == 1:
            out["kind"] = kinds[0]
        elif not kinds:
            out["review"].append("no section word in the title (lesson, season, care, welcome)")
        else:
            out["review"].append(f"the title fits more than one section: {kinds}")
    if not meta.get("published"):
        out["review"].append("no upload date")
    return out


def first_sentence(text: str, limit: int = 170) -> str:
    text = re.sub(r"[\U00010000-\U0010ffff]", "", text or "")
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("http") or "subscribe" in line.lower():
            continue
        parts = re.split(r"(?<=[.!?])\s+", line)
        s = parts[0].strip()
        if 20 <= len(s) <= limit:
            return s
        if len(s) > limit:
            return s[: limit - 3].rsplit(" ", 1)[0] + "..."
    return ""


def blurb_for(meta: dict, cls: dict) -> str:
    if cls["kind"] == "intro":
        return INTRO_BLURB[cls["topic"]]
    if cls["kind"] == "reading":
        return f"{TOPIC_LABEL[cls['topic']]} reading {cls['choice']} of 3 for {cls['round_label']}."
    return first_sentence(meta.get("description", "")) or f"New from Holly: {meta['title']}."


def redact(text: str) -> str:
    return re.sub(r"\bholly\b", "the reader", text or "", flags=re.I)


# ---------------------------------------------------------------- Jev (shadow suggestion only)
def jev_suggest(meta: dict, calls: list) -> dict | None:
    """Ask Jev which section it thinks the video belongs to. The answer only decorates the review
    ping; nothing ships on it (jevshape boundary). Logged like jev-try so outcomes can be recorded."""
    if JEV_OFF.exists() or not JEV_CARD.exists() or len(calls) >= MAX_JEV_CALLS:
        return None
    try:
        sys.path.insert(0, str(HOME / ".claude" / "bin"))
        import typesafe as T  # noqa: E402
        import jev_policy as P  # noqa: E402
        card = json.loads(JEV_CARD.read_text())
        budget = (card.get("budget") or {}).get("max_calls_per_run") or MAX_JEV_CALLS
        if len(calls) >= budget:
            return None
        pub = meta.get("published") or ""
        state = {
            "title": redact(meta["title"]),
            "description": redact(meta.get("description", ""))[:500],
            "duration_minutes": round(meta["duration"] / 60, 1),
            "upload_month": f"{MONTH_LABEL[int(pub[5:7]) - 1]} {pub[:4]}" if len(pub) == 10 else "",
        }
        questions = {qid: {k: v for k, v in q.items() if k not in ("state_fields", "note")}
                     for qid, q in card["questions"].items()}
        r = T.system_one(state, questions, caller="crystal-seed/videos-watch")
        res = P.evaluate(card, r.get("answers", {}), state)
        calls.append(r.get("cost_usd", 0))
        try:
            JEV_SHADOW.parent.mkdir(parents=True, exist_ok=True)
            with JEV_SHADOW.open("a") as fh:
                fh.write(json.dumps({"ts": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "card": card.get("name"),
                                     "card_version": card.get("version"), "policy": res, "state": state,
                                     "answers": r.get("answers"), "cost_usd": r.get("cost_usd"),
                                     "latency_ms": r.get("latency_ms"), "engine": r.get("engine"),
                                     "actual": None, "caller": "videos-watch"}, separators=(",", ":")) + "\n")
        except OSError:
            pass
        a = r.get("answers", {})
        section = a.get("section", {}); topic = a.get("topic", {})
        sp = section.get("probabilities", {}); tp = topic.get("probabilities", {})
        sec = section.get("choice")
        # intro versus reading is code's call (v1 asked Jev and it called readings intros): a set video
        # under four minutes is the intro, a numbered one is that reading, anything else stays "cyoa"
        kind = sec
        if sec == "cyoa":
            m = CHOICE_RX.search(meta["title"])
            kind = "intro" if meta["duration"] < 240 else (f"reading {next(g for g in m.groups() if g)}" if m else "cyoa (intro or reading)")
        return {"kind": kind, "kind_p": sp.get(sec, 0.0), "section": sec,
                "topic": topic.get("choice"), "topic_p": tp.get(topic.get("choice"), 0.0),
                "engine": r.get("engine"), "action": res.get("action"), "proposed": res.get("proposed")}
    except Exception as e:  # noqa: BLE001  (Jev is a decoration; a failure never stops the run)
        log(f"jev: no suggestion ({str(e)[:160]})")
        return None


# ---------------------------------------------------------------- notify
def telegram(text: str) -> bool:
    token = TG.get("TELEGRAM_BOT_TOKEN") or SECRET.get("VERA_TELEGRAM_BOT_TOKEN")
    chat = SECRET.get("RUSS_TELEGRAM_USER_ID")
    if not token or not chat:
        log("telegram: token or chat id missing")
        return False
    body = urllib.parse.urlencode({"chat_id": chat, "text": text[:4000], "disable_web_page_preview": "true"}).encode()
    try:
        with urllib.request.urlopen(urllib.request.Request(f"https://api.telegram.org/bot{token}/sendMessage", data=body), timeout=20) as r:
            ok = r.status == 200
    except Exception as e:  # noqa: BLE001
        log(f"telegram: send failed ({e})")
        return False
    log(f"telegram: sent={ok}")
    return ok


def bus(subject: str, text: str) -> bool:
    """A row on the handoffs bus so the next Kit session sees it. Fail-open."""
    url = SECRET.get("SUPABASE_PHARADOXA_URL"); key = SECRET.get("SUPABASE_PHARADOXA_SERVICE_KEY")
    if not (url and key):
        log("bus: no supabase credentials")
        return False
    body = json.dumps({"from_agent": "kit", "to_agent": "kit", "subject": f"[videos-watch] {subject}",
                       "content": text, "status": "outstanding"}).encode()
    req = urllib.request.Request(f"{url}/rest/v1/handoffs", data=body, headers={
        "apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json", "Prefer": "return=minimal"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            ok = r.status in (200, 201)
    except Exception as e:  # noqa: BLE001
        log(f"bus: insert failed ({e})")
        return False
    log(f"bus: inserted={ok}")
    return ok


def ask_line(text: str) -> bool:
    """One line in Obsidian's asks file, only when Russ has a call to make."""
    try:
        with ASKS_FILE.open("a") as fh:
            fh.write(f"- {datetime.now(PT).strftime('%Y-%m-%d %-I:%M %p')} | Crystal Seed videos | {text}\n")
        return True
    except OSError as e:
        log(f"ask line: {e}")
        return False


def notify(subject: str, text: str, needs_russ: bool = False) -> None:
    log(f"NOTIFY {subject}: {text[:200]!r}")
    if os.environ.get("VIDEOS_WATCH_QUIET"):  # tests: print the ping instead of sending it
        print(f"[QUIET, would send] {subject}\n{text}\n")
        return
    telegram(f"{subject}\n{text}")
    bus(subject, text)
    if needs_russ:
        ask_line(text.replace("\n", " "))


# ---------------------------------------------------------------- repo, build, deploy
def git(repo: Path, *args: str, check: bool = True, timeout: int = 120) -> str:
    return run(["git", *args], cwd=repo, check=check, timeout=timeout).stdout.strip()


def repo_guards(repo: Path, allow_dirty: bool = False) -> None:
    branch = git(repo, "branch", "--show-current")
    if branch != "main":
        raise RuntimeError(f"repo is on branch {branch!r}, not main")
    dirty = git(repo, "status", "--porcelain", "--", "lib/youtube-videos.json")
    if dirty and not allow_dirty:
        raise RuntimeError("lib/youtube-videos.json already has uncommitted changes (someone is mid-edit); not touching it")
    git(repo, "fetch", "--quiet", "origin", "main", timeout=180)
    ahead = git(repo, "rev-list", "--count", "origin/main..main")
    if ahead != "0":
        raise RuntimeError(f"local main is {ahead} commit(s) ahead of origin/main (unpushed work); not building on top of it")
    behind = git(repo, "rev-list", "--count", "main..origin/main")
    if behind != "0":
        git(repo, "merge", "--ff-only", "origin/main", timeout=180)
        log(f"repo: fast-forwarded main by {behind} commit(s)")


def deploy_target_ok(repo: Path) -> str:
    """The deploy-target rule, in code: the config and the remote must both name this site."""
    proj = json.loads((repo / ".vercel" / "project.json").read_text()).get("projectName")
    remote = git(repo, "remote", "get-url", "origin")
    if proj != VERCEL_PROJECT or GIT_REMOTE_MATCH not in remote:
        raise RuntimeError(f"deploy target mismatch: vercel project {proj!r}, remote {remote!r}")
    sentence = f"Deploying to Vercel project {proj} ({SITE}) by pushing origin main ({remote})."
    log("deploy target: " + sentence)
    return sentence


def dev_server_running(repo: Path) -> bool:
    r = run(["pgrep", "-fl", "next dev"], check=False, timeout=20)
    for line in (r.stdout or "").splitlines():
        pid = line.split()[0]
        cwd = run(["lsof", "-a", "-p", pid, "-d", "cwd", "-Fn"], check=False, timeout=20).stdout
        if str(repo) in cwd:
            return True
    return False


def build_gate(repo: Path) -> list[str]:
    notes = []
    run([str(repo / "node_modules" / ".bin" / "tsc"), "-p", "execution/tsconfig.videos.json"], cwd=repo, timeout=300)
    notes.append("type check ok")
    if dev_server_running(repo):
        notes.append("next build skipped (a dev server is running in this checkout)")
    else:
        run(["npm", "run", "build"], cwd=repo, timeout=900)
        notes.append("next build ok")
    return notes


def commit_and_push(repo: Path, message: str, push: bool) -> str:
    git(repo, "add", "--", "lib/youtube-videos.json")
    git(repo, "commit", "-q", "-m", message)
    sha = git(repo, "rev-parse", "--short", "HEAD")
    if push:
        git(repo, "push", "-q", "origin", "main", timeout=300)
        log(f"pushed {sha} to origin main")
    return sha


def verify_live(ids: list[str]) -> tuple[bool, int]:
    t0 = time.time()
    while time.time() - t0 < LIVE_WAIT_S:
        try:
            with urllib.request.urlopen(urllib.request.Request(f"{SITE}/videos?v={int(time.time())}",
                                                               headers={"User-Agent": "curl/8.7.1"}), timeout=30) as r:
                html = r.read().decode("utf-8", "replace")
            if all(i in html for i in ids):
                return True, int(time.time() - t0)
        except Exception as e:  # noqa: BLE001
            log(f"live check: {str(e)[:120]}")
        time.sleep(LIVE_POLL_S)
    return False, int(time.time() - t0)


def production_smoke(repo: Path) -> str:
    env = dict(os.environ, PATH=PATH_ENV + ":" + os.environ.get("PATH", ""), BASE=SITE, INTRO="0",
               OUT=str(LANE / "smoke"))
    r = subprocess.run(["node", "execution/videos-smoke.mjs"], cwd=str(repo), capture_output=True, text=True,
                       timeout=600, env=env)
    m = re.search(r"RESULT pass=(\d+) fail=(\d+)", r.stdout or "")
    (LANE / "smoke-last.log").write_text((r.stdout or "") + (r.stderr or ""))
    if not m:
        return f"smoke did not finish (exit {r.returncode}); see {LANE / 'smoke-last.log'}"
    return f"production smoke {m.group(1)} pass / {m.group(2)} fail"


# ---------------------------------------------------------------- the plan
def make_entry(meta: dict, cls: dict, blurb: str | None = None) -> dict:
    e = {"id": meta["id"], "title": meta["title"], "kind": cls["kind"]}
    if cls["kind"] in ("intro", "reading"):
        e["topic"] = cls["topic"]; e["round"] = cls["round"]
        if cls["kind"] == "reading":
            e["choice"] = cls["choice"]
    e["duration"] = meta["duration"]; e["published"] = meta["published"]
    e["blurb"] = blurb or blurb_for(meta, cls)
    return e


def plan_new(metas: list[dict], data: dict, state: dict, dry: bool) -> dict:
    """Split new videos into ship / pending (incomplete set) / review (rules could not place it)."""
    ship, pending, review = [], [], []
    jev_calls: list = []
    have = {(v.get("topic"), v.get("round")): {"intro": [], 1: [], 2: [], 3: []} for v in data["videos"] if v["kind"] in ("intro", "reading")}
    for v in data["videos"]:
        if v["kind"] == "intro":
            have[(v["topic"], v["round"])]["intro"].append(v["id"])
        elif v["kind"] == "reading":
            have[(v["topic"], v["round"])][v["choice"]].append(v["id"])
    sets: dict[tuple, dict] = {}
    for m in metas:
        cls = classify(m)
        if cls["review"]:
            sug = None if dry else jev_suggest(m, jev_calls)
            review.append({"meta": m, "cls": cls, "jev": sug})
            continue
        if cls["kind"] in ("intro", "reading"):
            k = (cls["topic"], cls["round"])
            sets.setdefault(k, {"members": [], "cls": cls})["members"].append((m, cls))
        else:
            ship.append(make_entry(m, cls))
    for k, s in sets.items():
        slots = {"intro": list(have.get(k, {}).get("intro", [])), 1: list(have.get(k, {}).get(1, [])),
                 2: list(have.get(k, {}).get(2, [])), 3: list(have.get(k, {}).get(3, []))}
        for m, cls in s["members"]:
            slots["intro" if cls["kind"] == "intro" else cls["choice"]].append(m["id"])
        dupes = {slot: ids for slot, ids in slots.items() if len(ids) > 1}
        if dupes:
            for m, cls in s["members"]:
                cls["review"].append(f"two videos claim the same slot in the {k[0]}/{k[1]} set: {dupes}")
                review.append({"meta": m, "cls": cls, "jev": None})
            continue
        complete = all(len(ids) == 1 for ids in slots.values())
        entries = [make_entry(m, cls) for m, cls in sorted(s["members"], key=lambda mc: (0 if mc[1]["kind"] == "intro" else mc[1]["choice"]))]
        if complete:
            ship.append({"_set": k, "_label": s["cls"]["round_label"], "_short": s["cls"]["round_short"], "entries": entries})
        else:
            missing = [str(slot) for slot, ids in slots.items() if not ids]
            pending.append({"set": k, "label": s["cls"]["round_label"], "entries": entries, "missing": missing})
    return {"ship": ship, "pending": pending, "review": review, "jev_cost": sum(jev_calls)}


def apply_plan(data: dict, ship: list) -> tuple[list[dict], list[str]]:
    """Put the new rows into the data (newest first). Returns (entries added, lines for the ping)."""
    added, lines = [], []
    keys = {r["key"] for r in data["rounds"]}
    for item in ship:
        if "entries" in item:
            topic, rkey = item["_set"]
            if rkey not in keys:
                data["rounds"].insert(0, {"key": rkey, "label": item["_label"], "short": item["_short"]})
                data["rounds"].sort(key=lambda r: r["key"], reverse=True)
                keys.add(rkey)
            added.extend(item["entries"])
            lines.append(f"{item['_label']} {TOPIC_LABEL[topic]} set (intro + 3 readings): {SITE}/videos#{topic}/{rkey}")
        else:
            added.append(item)
            lines.append(f"{item['kind']}: \"{item['title']}\" ({item['duration'] // 60} min) in More from the channel; blurb is the first line of the YouTube description, polish with --add {item['id']} --kind {item['kind']} --blurb \"...\"")
    added.sort(key=lambda e: (e["published"], 0 if e["kind"] == "intro" else (e.get("choice") or 9)), reverse=False)
    # newest published first, intro before its readings
    groups: dict[str, list] = {}
    for e in added:
        groups.setdefault(e["published"], []).append(e)
    ordered = []
    for pub in sorted(groups, reverse=True):
        ordered.extend(sorted(groups[pub], key=lambda e: (0 if e["kind"] in ("intro", "reading") else 1,
                                                          e.get("topic") and TOPIC_ORDER.index(e["topic"]) or 0,
                                                          0 if e["kind"] == "intro" else (e.get("choice") or 0))))
    data["videos"] = ordered + data["videos"]
    data["channel"]["pulled"] = datetime.now(PT).strftime("%Y-%m-%d")
    return ordered, lines


def ship(repo: Path, data: dict, ship_items: list, push: bool, dry: bool) -> tuple[str, list[str]]:
    """Write, validate, gate, commit, push, prove live, smoke. Returns (headline, receipt lines)."""
    before = json.dumps(load_data(repo))
    added, lines = apply_plan(data, ship_items)
    problems = validate(data)
    if problems:
        raise RuntimeError("data would not validate: " + "; ".join(problems[:5]))
    if dry:
        return f"DRY RUN: would add {len(added)} video(s)", lines + [json.dumps(e, ensure_ascii=False) for e in added]
    save_data(repo, data)
    receipts = []
    try:
        receipts += build_gate(repo)
        target = deploy_target_ok(repo)
        titles = "\n".join(f"- {e['title']} ({e['id']})" for e in added)
        sha = commit_and_push(repo, f"feat(videos): {len(added)} new video(s) from YouTube, placed by videos-watch\n\n{titles}\n\nCo-Authored-By: videos-watch <kit@generuss.com>", push)
        receipts.append(f"commit {sha}")
    except Exception:
        (repo / "lib" / "youtube-videos.json").write_text(before)  # put the file back exactly as it was
        git(repo, "checkout", "--", "lib/youtube-videos.json", check=False)
        raise
    if push:
        ok, secs = verify_live([e["id"] for e in added])
        receipts.append(f"live page carries the new ids after {secs // 60} min {secs % 60} s" if ok
                        else f"LIVE CHECK FAILED: ids not on {SITE}/videos after {secs // 60} min; Vercel build may have failed")
        if ok:
            receipts.append(production_smoke(repo))
    else:
        receipts.append("push skipped (--no-push)")
    return f"{len(added)} new video(s) on the site", lines + receipts


# ---------------------------------------------------------------- runs
def fmt_review(item: dict) -> str:
    m, cls, j = item["meta"], item["cls"], item.get("jev")
    line = f"\"{m['title']}\" ({m['duration'] // 60} min, up {m['published']}): " + "; ".join(cls["review"]) + "."
    if j and j.get("kind"):
        line += f" Jev suggests {j['kind']} ({j['kind_p']:.2f})"
        if j.get("section") == "cyoa" and j.get("topic") and j["topic"] != "not_cyoa":
            line += f", path {j['topic']} ({j['topic_p']:.2f})"
        line += f" [{j.get('engine')}, shadow only, nothing ships on it]."
    hint = f"python3 execution/videos-watch.py --add {m['id']} --kind <intro|reading|lesson|season|care|welcome>"
    if j and j.get("section") == "cyoa":
        hint += " --topic <money|general|love> [--choice <1|2|3>]"
    return line + f" To place it: {hint}. To drop it: --ignore {m['id']}."


def due(state: dict, vid: str, bucket: str) -> bool:
    """Ping about a pending or review item on first sight, then every REPING_DAYS days."""
    last = (state.get(bucket) or {}).get(vid, {}).get("pinged")
    if not last:
        return True
    return datetime.now(timezone.utc) - datetime.fromisoformat(last) >= timedelta(days=REPING_DAYS)


def nightly(repo: Path, dry: bool, push: bool) -> int:
    state = load_state()
    data = load_data(repo)
    problems = validate(data)
    if problems:
        notify("Crystal Seed videos: the data file is broken", "; ".join(problems[:6]) + f"\nFix lib/youtube-videos.json in {repo}.")
        return 1
    known = {v["id"] for v in data["videos"]}
    ignored = set((state.get("ignored") or {}).keys())
    try:
        listing = channel_listing(data)
        source = "yt-dlp"
    except RuntimeError as e:
        log(f"falling back to RSS: {e}")
        try:
            listing = rss_listing(data)
            source = "rss"
        except Exception as e2:  # noqa: BLE001
            notify("Crystal Seed videos: could not read the channel", f"yt-dlp: {str(e)[:200]}\nRSS: {str(e2)[:200]}")
            return 1
    channel_ids = [e["id"] for e in listing]
    new_ids = [i for i in channel_ids if i not in known and i not in ignored]
    gone = sorted(known - set(channel_ids)) if source == "yt-dlp" else []
    log(f"channel via {source}: {len(channel_ids)} videos, {len(new_ids)} new, {len(gone)} on the site but not on the channel")
    state.setdefault("runs", []).append({"at": datetime.now(timezone.utc).isoformat(), "source": source,
                                         "channel": len(channel_ids), "new": len(new_ids)})
    state["runs"] = state["runs"][-60:]

    messages: list[tuple[str, str, bool]] = []
    if source == "rss" and new_ids:
        messages.append(("Crystal Seed videos: new uploads seen, yt-dlp is down",
                         f"{len(new_ids)} new id(s) on the channel feed but yt-dlp failed, so no durations and nothing shipped: {', '.join(new_ids)}. Fix yt-dlp (brew upgrade yt-dlp), then run the watchdog again.", False))
        new_ids = []
    if gone:
        fresh = [i for i in gone if i not in (state.get("gone") or {})]
        if fresh:
            messages.append(("Crystal Seed videos: a video left the channel",
                             "On the site but not on the channel any more (unlisted, private or deleted?): " + ", ".join(fresh) + ". Nothing removed; take it out of lib/youtube-videos.json by hand if it is gone for good.", True))
            for i in fresh:
                state.setdefault("gone", {})[i] = datetime.now(timezone.utc).isoformat()

    exit_code = 0
    if new_ids:
        metas = []
        for vid in new_ids:
            try:
                metas.append(video_meta(vid))
            except Exception as e:  # noqa: BLE001
                log(f"meta {vid}: {str(e)[:200]}")
                messages.append(("Crystal Seed videos: could not read a video", f"yt-dlp failed on {vid}: {str(e)[:200]}", False))
        p = plan_new(metas, data, state, dry)
        if p["ship"]:
            try:
                headline, lines = ship(repo, data, p["ship"], push, dry)
                messages.append((f"Crystal Seed videos: {headline}", "\n".join(lines), False))
                if not dry:
                    for item in p["ship"]:
                        for e in (item.get("entries") or [item]):
                            state.setdefault("shipped", {})[e["id"]] = datetime.now(timezone.utc).isoformat()
            except Exception as e:  # noqa: BLE001
                log(f"ship failed: {e}")
                messages.append(("Crystal Seed videos: new videos found, the ship step failed", f"{str(e)[:900]}\nNothing was pushed. The data file is back to its committed state. Run: python3 execution/videos-watch.py --dry-run", False))
                exit_code = 1
        for item in p["pending"]:
            key = f"{item['set'][0]}/{item['set'][1]}"
            if dry or due(state, key, "pending"):
                messages.append(("Crystal Seed videos: a set is still incomplete",
                                 f"{item['label']} {TOPIC_LABEL[item['set'][0]]}: {len(item['entries'])} of 4 videos are up (missing {', '.join(item['missing'])}). It goes on the site the night the set is complete.", False))
                if not dry:
                    state.setdefault("pending", {})[key] = {"pinged": datetime.now(timezone.utc).isoformat(), "have": [e["id"] for e in item["entries"]]}
        lines = []
        for item in p["review"]:
            vid = item["meta"]["id"]
            if dry or due(state, vid, "review"):
                lines.append(fmt_review(item))
                if not dry:
                    state.setdefault("review", {})[vid] = {"pinged": datetime.now(timezone.utc).isoformat(), "title": item["meta"]["title"], "reasons": item["cls"]["review"]}
        if lines:
            messages.append(("Crystal Seed videos: needs a call", "\n".join(lines) + "\nNothing changed on the site for these.", True))
        if p["jev_cost"]:
            log(f"jev spend this run ${p['jev_cost']:.5f}")

    for subject, text, needs_russ in messages:
        if dry:
            print(f"\n[DRY RUN would send] {subject}\n{text}\n")
        else:
            notify(subject, text, needs_russ)
    if not dry:
        save_state(state)
    if not messages:
        log("nothing new; silent by design")
    return exit_code


def add_by_hand(repo: Path, a) -> int:
    meta = video_meta(a.add)
    cls = classify(meta)
    cls["review"] = []
    cls["kind"] = a.kind
    if a.kind in ("intro", "reading"):
        if not a.topic:
            print("--topic is required for an intro or a reading"); return 2
        cls["topic"] = a.topic
        if a.round:
            y, m = int(a.round[:4]), int(a.round[5:7])
            cls["round"], cls["round_label"], cls["round_short"] = a.round, f"{MONTH_LABEL[m - 1]} {y}", f"{MONTH_SHORT[m - 1]} {y}"
        elif not cls["round"]:
            cls["round"], cls["round_label"], cls["round_short"] = round_from(meta["title"], meta["published"])
        if a.kind == "reading":
            if not a.choice:
                print("--choice is required for a reading"); return 2
            cls["choice"] = a.choice
    else:
        cls["topic"] = cls["round"] = cls["choice"] = None
    data = load_data(repo)
    entry = make_entry(meta, cls, a.blurb)
    if a.kind in ("intro", "reading"):
        item = {"_set": (cls["topic"], cls["round"]), "_label": cls["round_label"], "_short": cls["round_short"], "entries": [entry]}
    else:
        item = entry
    repo_guards(repo)
    headline, lines = ship(repo, data, [item], not a.no_push, a.dry_run)
    st = load_state()
    st.setdefault("review", {}).pop(meta["id"], None)
    st.setdefault("shipped", {})[meta["id"]] = datetime.now(timezone.utc).isoformat()
    if not a.dry_run:
        save_state(st)
        notify(f"Crystal Seed videos: {headline} (placed by hand)", "\n".join(lines))
    print(headline); print("\n".join(lines))
    return 0


def replay(repo: Path) -> int:
    data = load_data(repo)
    misses = 0
    for v in data["videos"]:
        cls = classify({"title": v["title"], "duration": v["duration"], "published": v["published"]})
        want = (v["kind"], v.get("topic"), v.get("round"), v.get("choice"))
        got = (cls["kind"], cls["topic"], cls["round"], cls["choice"])
        ok = not cls["review"] and got == want
        misses += 0 if ok else 1
        print(f"{'ok  ' if ok else 'MISS'} {v['id']} {v['title'][:60]:<60} want={want} got={got} {cls['review']}")
    print(f"replay: {len(data['videos']) - misses}/{len(data['videos'])} placed by the rules")
    return 0 if misses == 0 else 1


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--replay", action="store_true")
    ap.add_argument("--ping-test", action="store_true")
    ap.add_argument("--add", metavar="ID")
    ap.add_argument("--kind", choices=KINDS)
    ap.add_argument("--topic", choices=TOPIC_ORDER)
    ap.add_argument("--choice", type=int, choices=(1, 2, 3))
    ap.add_argument("--round", metavar="YYYY-MM")
    ap.add_argument("--blurb")
    ap.add_argument("--ignore", metavar="ID")
    ap.add_argument("--why", default="")
    ap.add_argument("--no-push", action="store_true")
    ap.add_argument("--repo", default=str(DEFAULT_REPO), help="the checkout to work in (default: the repo this file lives in)")
    a = ap.parse_args(argv)
    repo = Path(a.repo).resolve()

    if OFF.exists() and not (a.dry_run or a.replay):
        log("kill switch present; exiting 3"); return 3
    if a.replay:
        return replay(repo)
    if a.ping_test:
        notify("Crystal Seed videos: test ping", f"The watchdog can reach you. {now_pt()}. Nothing happened.")
        return 0
    if a.ignore:
        st = load_state(); st.setdefault("ignored", {})[a.ignore] = {"at": datetime.now(timezone.utc).isoformat(), "why": a.why}
        st.setdefault("review", {}).pop(a.ignore, None); save_state(st); print(f"ignored {a.ignore}"); return 0
    if a.add:
        if not a.kind:
            print("--kind is required with --add"); return 2
        return add_by_hand(repo, a)

    try:
        LOCK.mkdir(parents=True, exist_ok=False)
    except FileExistsError:
        age = time.time() - LOCK.stat().st_mtime
        if age < 3600:
            log(f"another run holds the lock ({int(age)} s); exiting 3"); return 3
        log("stale lock; taking it")
    try:
        yv = run([YTDLP, "--version"], check=False, timeout=30).stdout.strip()
        log(f"run start ({'dry' if a.dry_run else 'live'}) python {sys.version.split()[0]} yt-dlp {yv} repo {repo}")
        if not a.dry_run:
            repo_guards(repo)
        return nightly(repo, a.dry_run, not a.no_push)
    except Exception as e:  # noqa: BLE001
        log(f"run failed: {e}")
        if not a.dry_run:
            notify("Crystal Seed videos: the watchdog failed", f"{str(e)[:900]}\nNothing changed on the site.")
        return 1
    finally:
        shutil.rmtree(LOCK, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
