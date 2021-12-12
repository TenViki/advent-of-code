from collections import Counter
from queue import Queue
from collections import defaultdict


def readInput12(filename):
    cave = defaultdict(lambda: [])
    with open(filename) as f:
        for l in f.readlines():
            n = l.strip('\n').split("-")
            cave[n[0]].append(n[1])
            cave[n[1]].append(n[0])
    return cave


cave0 = readInput12("in.txt")


def part2(cave):
    paths = Queue()
    paths.put(['start'])
    completes = []
    while paths.queue:
        p0 = paths.get()
        for s in cave[p0[-1]]:
            # avoid going back to start
            if s == 'start':
                continue
            # if cave is lowercase, count all lowercase cave already in path and check if one already appers twice
            if s.lower() == s:
                c = Counter([p for p in p0 if p.lower() == p])
                if 2 in c.values() and s in p0:
                    continue
            p1 = list(p0)
            p1.append(s)
            if s == 'end':
                completes.append(p1)
            else:
                paths.put(p1)
    return completes


path0 = part2(cave0)
print("Test 2:", len(path0))
