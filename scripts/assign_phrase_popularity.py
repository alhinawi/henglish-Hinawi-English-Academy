#!/usr/bin/env python3
"""Assign a popularity tier (1-5) to every phrase-bank entry.

Usage: python3 scripts/assign_phrase_popularity.py <bank-index.json> [...]

Method (standing rule: most common first, rare last):
  tier 1 = very common: heard weekly in everyday speech/media (hand-curated
           TIER1 lists below, matched by exact phrase)
  tier 2 = common: well known to most native speakers (hand-curated TIER2)
  tier 3 = neutral: known but not frequent (DEFAULT for everything else)
  tier 4 = literary / old-fashioned / formal-register-only
  tier 5 = rare or archaic (RARE_MARKERS / archaic forms)
New batches rerun this script; unlisted entries land at tier 3 until curated.

The tier is stored as an integer field `popularity` on each entry (extra
fields are allowed by check_phrase_chunks.py). UI default sort:
popularity asc, then alphabetical.
"""
import json
import os
import sys

TIER1_IDIOMS = {
    "break the ice", "a piece of cake", "hit the sack", "raining cats and dogs",
    "under the weather", "costs an arm and a leg", "once in a blue moon",
    "call it a day", "hit the nail on the head", "let the cat out of the bag",
    "kill two birds with one stone", "break a leg", "bite the bullet",
    "the last straw", "on cloud nine", "over the moon", "see eye to eye",
    "spill the beans", "the ball is in your court", "when pigs fly",
    "better late than never", "practice makes perfect", "speak of the devil",
    "out of the blue", "on the same page", "get cold feet", "hang in there",
    "it's not rocket science", "take it easy", "time flies", "no pain, no gain",
    "blessing in disguise", "actions speak louder than words",
    "you can't judge a book by its cover", "miss the boat", "sit tight",
    "pull someone's leg", "beat around the bush", "cut corners",
    "give someone the benefit of the doubt", "in the same boat",
    "the early bird catches the worm", "through thick and thin",
    "easy come, easy go", "hit the books", "on the ball", "by the book",
    "get out of hand", "keep an eye on", "learn by heart", "make up your mind",
    "never mind", "on time", "in time", "take your time", "have a good time",
    "a big deal", "no big deal", "for good", "as soon as possible",
    "at the end of the day", "back to square one", "be my guest",
    "behind the scenes", "best of both worlds", "get a kick out of",
    "give it a shot", "go with the flow", "hit the road", "in a nutshell",
    "in no time", "it takes two to tango", "keep your chin up",
    "long story short", "luck be on your side", "make a long story short",
    "no strings attached", "on the house", "out of order", "out of stock",
    "play it by ear", "right on time", "rings a bell", "rule of thumb",
    "sleep on it", "so far so good", "take a rain check", "that ship has sailed",
    "the sky's the limit", "to each their own", "up in the air",
    "wake up on the wrong side of the bed", "watch your back", "way to go",
    "what's up", "you bet", "your guess is as good as mine",
}

TIER2_IDIOMS = {
    "a blessing in disguise", "a breath of fresh air", "a drop in the bucket",
    "a hot potato", "a man of his word", "a storm in a teacup",
    "add insult to injury", "against the clock", "all ears",
    "an apple a day keeps the doctor away", "as cool as a cucumber",
    "at the drop of a hat", "back against the wall", "barking up the wrong tree",
    "be on cloud nine", "bear in mind", "bend over backwards",
    "between the lines", "blood is thicker than water", "blow off steam",
    "break a leg", "break someone's heart", "bring home the bacon",
    "burn the midnight oil", "by word of mouth", "caught red-handed",
    "cold shoulder", "come rain or shine", "cost a fortune",
    "cross my heart", "cry over spilled milk", "curiosity killed the cat",
    "cut to the chase", "dead ringer", "down to earth",
    "draw the line", "drive someone crazy", "drop a bombshell",
    "every cloud has a silver lining", "face the music", "fall in love",
    "fed up", "feel under the weather", "fifth wheel", "find your feet",
    "first things first", "food for thought", "for a change",
    "from scratch", "get cold feet", "get something off your chest",
    "get the hang of it", "get the ball rolling", "get out of my way",
    "give someone a hand", "go the extra mile", "green with envy",
    "hit the jackpot", "hit the spot", "hold your horses",
    "in a pickle", "in full swing", "in hot water", "in the blink of an eye",
    "in the long run", "it slipped my mind", "keep a straight face",
    "keep it under your hat", "kick the bucket", "knock on wood",
    "lend an ear", "let sleeping dogs lie", "light at the end of the tunnel",
    "like a fish out of water", "lose your temper", "make ends meet",
    "mind your own business", "neither here nor there", "no-brainer",
    "not my cup of tea", "off the hook", "off the record",
    "on a tight budget", "on second thoughts", "on the tip of my tongue",
    "once and for all", "out of the woods", "out of your mind",
    "over my dead body", "paint the town red", "pie in the sky",
    "prevention is better than cure", "push your luck", "put your foot down",
    "rain check", "red-handed", "rock the boat", " Rome wasn't built in a day",
    "rome wasn't built in a day", "safe and sound", "saved by the bell",
    "sell like hotcakes", "shot in the dark", "sick and tired",
    "silver lining", "sitting duck", "skeleton in the closet",
    "smell a rat", "sooner or later", "steal someone's thunder",
    "take something with a grain of salt", "take the bull by the horns",
    "the best of both worlds", "the icing on the cake",
    "the tip of the iceberg", "the whole nine yards", "third time's the charm",
    "through the grapevine", "throw in the towel", "tongue in cheek",
    "turn a blind eye", "two peas in a pod", "under the table",
    "up to no good", "wear your heart on your sleeve", "wet blanket",
    "win-win", "word of mouth", "work against the clock",
    "you can say that again", "zero in on",
}

TIER1_SLANG = {
    "dude", "bro", "mate", "cool", "awesome", "chill", "hang out", "no way",
    "for real", "broke", "buck", "cop", "gotta", "wanna", "gonna", "kinda",
    "yeah", "nah", "stuff", "guy", "guys", "crazy", "nuts", "lame", "dope",
    "sick", "sweet", "nerd", "pal", "scam", "shady", "pissed", "hyped",
    "bud", "buddy", "chick", "flick", "freebie", "geek", "grub", "junk",
    "kidding", "legit", "loaded", "mint", "pumped", "ripped", "stoked",
    "totally", "vibes", "wasted", "wicked", "yikes", "zonked", "a-ok",
    "bummed", "bust", "busted", "cheesy", "creepy", "flaky", "hassle",
    "jerk", "kick it", "my bad", "no-brainer", "peeps", "pooped", "psyched",
    "rip-off", "snooze", "splurge", "suck-up", "take it easy", "veg out",
    "whiz", "whip", "zilch", "zit", "bucks", "cash", "cash cow", "cutie",
    "dang", "brainwave", "rough", "bougie", "big deal", "big mouth",
    "couch potato", "crash", "ditzy", "dork", "dyno", "fire", "goat",
    "goof", "grand", "gun", "hit up", "ice", "innit", "lowkey", "highkey",
    "salty", "savage", "ship", "sis", "snack", "stan", "sus", "tea",
    "throw shade", "wack", "yolo", "flex", "clout", "extra",
}

TIER2_SLANG = {
    "ace", "ain't", "all good", "apple of discord", "bad-mouth", "bag",
    "ballpark", "banger", "beans", "beat", "beef", "bent", "big shot",
    "bigwig", "blimey", "blow", "bog", "bomb", "bonkers", "boost",
    "botch", "bounce", "bread", "brew", "brill", "brush-off", "bummer",
    "bunk", "buzz", "canned", "catch on", "cheapskate", "chew the fat",
    "chuffed", "clam up", "clunker", "conk out", "crack up", "crappy",
    "croak", "crumbs", "cuppa", "dosh", "dough", "ducky", "duff",
    "earful", "easy-peasy", "fad", "faff", "fancy", "fiver", "flake out",
    "flog", "fluke", "fork out", "freak out", "full-on", "gander",
    "gear", "geezer", "gobsmacked", "gravy", "guff", "gutted", "hacker",
    "haggle", "hick", "hunky-dory", "hush-hush", "janky", "jazzed",
    "jiffy", "jolly", "kibosh", "knackered", "knees-up", "lark", "lash",
    "lodge", "lolly", "lousy", "luv", "miffed", "mooch", "moolah",
    "muck up", "mug", "mumbo jumbo", "naff", "niggle", "nip", "nosh",
    "nowt", "nutter", "oodles", "owt", "peek", "pep talk", "phub",
    "pittance", "plastered", "plonk", "pongo", "pop in", "posh", "quid",
    "ratty", "ropey", "rubbish", "rumbled", "scarper", "scoff", "skint",
    "sloshed", "smashing", "snog", "sod", "spiffing", "stonking",
    "ta", "telly", "tenner", "throw a wobbly", "tosh", "twig", "uni",
    "veg", "waffle", "wee", "wellies", "whinge", "wind-up", "wonky",
    "yack", "yonks", "zonk out",
}

RARE_MARKERS = {
    "thou", "thee", "thy", "forsooth", "erstwhile", "betwixt", "whence",
    "henceforth", "hither", "thither", "ye ", "'tis", "verily", "prithee",
    "zounds", "gadzooks", "codswallop", "tickety-boo", "spiffing",
    "old hat", "horse and buggy", "the bee's knees", "the cat's pajamas",
    "23 skidoo", "hooch", "jalopy", "sockdolager", "absquatulate",
}

LISTS = {
    "idm": (TIER1_IDIOMS, TIER2_IDIOMS),
    "slg": (TIER1_SLANG, TIER2_SLANG),
    "gnz": (set(), set()),
}


def tier_for(bank_prefix, phrase, register):
    p = phrase.strip().lower()
    t1, t2 = LISTS.get(bank_prefix, (set(), set()))
    if p in t1:
        return 1
    if p in t2:
        return 2
    if any(m in p for m in RARE_MARKERS):
        return 5
    if register == "formal":
        return 4
    return 3


def main():
    for index_path in sys.argv[1:]:
        index = json.load(open(index_path, encoding="utf-8"))
        prefix = index.get("idPrefix", "")
        chunks_dir = os.path.join(os.path.dirname(index_path), "chunks")
        hist = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for name in index.get("chunks", []):
            path = os.path.join(chunks_dir, name)
            rows = json.load(open(path, encoding="utf-8"))
            for r in rows:
                r["popularity"] = tier_for(prefix, r.get("phrase", ""), r.get("register", ""))
                hist[r["popularity"]] += 1
            with open(path, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
                f.write("\n")
        print(f"{index_path}: tiers {dict(sorted(hist.items()))}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main()
