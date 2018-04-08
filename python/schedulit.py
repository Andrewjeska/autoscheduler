# SCHEDULIT.PY

################################################################################################################
# MYHEAPQ.PY
################################################################################################################
def _siftdown(heap, startpos, pos):
    newitem = heap[pos]
    # Follow the path to the root, moving parents down until finding a place
    # newitem fits.
    while pos > startpos:
        parentpos = (pos - 1) >> 1
        parent = heap[parentpos]
        if newitem[0] < parent[0]:
            heap[pos] = parent
            pos = parentpos
            continue
        break
    heap[pos] = newitem

def _siftup(heap, pos):
    endpos = len(heap)
    startpos = pos
    newitem = heap[pos]
    # Bubble up the smaller child until hitting a leaf.
    childpos = 2*pos + 1    # leftmost child position
    while childpos < endpos:
        # Set childpos to index of smaller child.
        rightpos = childpos + 1
        if rightpos < endpos and not heap[childpos][0] < heap[rightpos][0]:
            childpos = rightpos
        # Move the smaller child up.
        heap[pos] = heap[childpos]
        pos = childpos
        childpos = 2*pos + 1
    # The leaf at pos is empty now.  Put newitem there, and bubble it up
    # to its final resting place (by sifting its parents down).
    heap[pos] = newitem
    _siftdown(heap, startpos, pos)

def heappush(heap, item):
    """Push item onto heap, maintaining the heap invariant."""
    heap.append(item)
    _siftdown(heap, 0, len(heap)-1)

def heappop(heap):
    """Pop the smallest item off the heap, maintaining the heap invariant."""
    lastelt = heap.pop()    # raises appropriate IndexError if heap is empty
    if heap:
        returnitem = heap[0]
        heap[0] = lastelt
        _siftup(heap, 0)
    else:
        returnitem = lastelt
    return returnitem
















################################################################################################################
# HEURISTIC.PY
################################################################################################################
import math
''' BEGIN TESTING '''
from copy import deepcopy

class Global_Info:
  def __init__(self):
    self.minimum = 1
    self.maximum = 4 * 2
    self.average = (self.minimum + self.maximum)//2

global_info = Global_Info()

class State:
  def __init__(self, tasks, schedule):
    self.tasks = tasks
    self.schedule = schedule

  def __str__(self):
    return "Tasks: %s\nSchedule: %s" % (str(self.tasks), str(self.schedule))

  def __repr__(self):
    return self.__str__()

class Task:
  def __init__(self, time, until_deadline, name, pref):
    self.time = time
    self.time_until_due = until_deadline
    self.name = name
    self.blocks = []
    self.preference = pref

  def __repr__(self):
    return self.name +"\n" + str(self.blocks)







class Block:
  def __init__(self, isMandatory, name, time, pref):
    self.isMandatory = isMandatory
    self.name = name
    self.time = time
    self.preference = pref


  def __str__(self):
    if self.isMandatory:
      return "mandator"
    else:
      return self.name + str(self.time)

  def __repr__(self):
    if self.isMandatory:
      return "mandator"
    else:
      return self.name + str(self.time)



def start_state(tasks, schedule):
  schedule = schedule[:]
  for task in tasks:
    so_far = 0
    num_blocks = math.ceil(task.time / global_info.average)
    for block in range(num_blocks):
      desired_time = block * task.time_until_due // num_blocks
      for block_part in range(min(task.time - so_far, global_info.average)):
        shift = 0
        while schedule[(desired_time + block_part + shift) % len(schedule)]:
          shift += 1
        block = Block(False, task.name, (desired_time + block_part + shift) % len(schedule), task.preference)
        schedule[(desired_time + block_part + shift) % len(schedule)] = block
        task.blocks.append(block)
      so_far += global_info.average

  return State(tasks, schedule)



def swap(schedule, to, outof):
  blockfrom = schedule[outof]
  blockto = schedule[to]
  schedule[to] = blockfrom
  schedule[outof] = blockto

  if blockfrom != 0:
    blockfrom.time = to
  if blockto != 0:
    blockto.time = outof

def isvalid(schedule, task, block, offset):
  if block.time + offset >= len(schedule) or block.time + offset < 0:
    return False

  other = schedule[block.time + offset]
  if other == 0:
    return True



  if other.isMandatory:
    return False

  if other.name == block.name:
    count = 0
    while other != 0 and other.name != block.name:
      other = schedule[block.time + offset]
      offset += 1
      count += 1
    if count > global_info.maximum:
      return False


  return True

def neighbors(state, offset=1):
  neighbor = []
  for task in state.tasks:
    for block in task.blocks:
      if isvalid(state.schedule, task, block, offset):

        newstate = deepcopy(state)
        swap(newstate.schedule, block.time + offset, block.time)
        neighbor.append(newstate)

      if isvalid(state.schedule, task, block, -offset):
        newstate = deepcopy(state)
        swap(newstate.schedule, block.time - offset, block.time)
        neighbor.append(newstate)

  return neighbor

def heuristic(state, switch = False):
  if not switch:
    score = 0
    variance = 0
    worst = 0
    variance2 = 0
    for task in state.tasks:
      order = sorted(task.blocks, key=lambda x: x.time)
      for block1, block2 in zip(order[:-1], order[1:]):
        variance += (block2.time - block1.time) ** 2 / len(state.schedule) ** 2
        worst += 1

      variance2 += (order[-1].time - task.time) ** 2 / max(len(state.schedule) - task.time, task.time) ** 2
      score += variance / worst * .3 + variance2 / len(state.tasks) * .45

    variance = 0
    worst = 0
    block_list = []
    cur_buf = []
    for entry in state.schedule:

      if entry != 0 and not entry.isMandatory:
        if not cur_buf:
          cur_buf = [entry]
        elif entry.time - cur_buf[-1].time > 12:
          block_list.append(cur_buf)
          cur_buf = [entry]
        else:
          cur_buf.append(entry)

    # compactness and happiness
    worst1 = 0
    variance1 = 0
    worst2 = 0
    variance2 = 0
    for group in block_list:
      for ind in range(len(group) - 1):
        variance1 += (group[ind + 1].time - group[ind].time) ** 2 / 12 ** 2
        worst1 += 1
        offset = 100 - (group[ind + 1].preference - group[ind].preference) ** 2
        variance2 += offset / 10 ** 2
        worst2 += 1

        if offset == 0:
          variance2 += 10

    score += variance1 / worst1 * .15 + (1 - variance2 / worst2) * .1

    return score
  else:
    variance = 0
    worst = 0
    target = 0
    for task in state.tasks:
      for block in task.blocks:
        variance += (block.time - target) ** 2
        worst += max(target, len(state.schedule) - target) ** 2


    return 1 - variance / worst















################################################################################################################
# ASTAR.PY
################################################################################################################
import calendar
import time
since_epoch = calendar.timegm(time.gmtime())
since_epoch -= since_epoch % (60 * 30)
def myformat(state):
  tasks = {}
  for task in state.tasks:
    tasks[task.name] = []
    ordered = sorted(task.blocks, key=lambda x: x.time)
    groups = []
    cur_block = []
    prev_time = -2
    for block in ordered:
      if prev_time + 1 != block.time:
        if cur_block:
          groups.append(cur_block)

        cur_block = []

      prev_time = block.time
      cur_block.append(block.time)

    if cur_block:
      groups.append(cur_block)

    for group in groups:
      dates = {}
      fromtime = since_epoch + group[0] * 30 * 60
      totime = since_epoch + group[-1] * 30 * 60
      dates["From"] = fromtime
      dates["To"] = totime + 1
      tasks[task.name].append(dates)
  return tasks


def end_state_gen(heuristic):
  def end_state(state, count, prev):
    result = heuristic(state)
    if abs(prev[0] - result) < .0003:
      count[0] += 1
    else:
      prev[0] = result
      count[0] = 0
    return count[0] > 10
  return end_state

def astar(start_state, neighbors, heuristic):
  seen_states = set()
  end_state = end_state_gen(heuristic)
  heap = [(1, start_state)]

  cur_state = start_state
  count = [0]
  prev = [-1]
  while not end_state(cur_state, count, prev) and heap:
    temp = heappop(heap)
    value = temp[0]
    #print("value: " + str(value))
    cur_state = temp[1]
    seen_states.add(tuple(cur_state.schedule))
    for n in neighbors(cur_state):
      if n in seen_states:
        continue

      value = heuristic(n)

      heappush(heap, (value, n))

  return myformat(cur_state)






################################################################################################################
# MAIN.PY
################################################################################################################
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = []

@app.route('/sendTasks', methods=['GET', 'POST'])
def handler():
    print("hello friend")
    content = request.json
    print(content)
    requestTasks = content['tasks'] #tasks from json

    tasks = []
    permaEvents = content['permanentEvents'] #permanent events from json
    stime = content['startSleep'] - since_epoch
    etime = content['endSleep'] - since_epoch
    stime = int(stime / 60 // 30)
    etime = int(etime / 60 // 30)

    perma_offsets = []
    obj = {stime, etime}


    for p in permaEvents:
      print("due:"  + str(p["dueDate"]))
      st = (p["dueDate"] - since_epoch) / 60 // 30
      et = st + p["duration"]
      obj2 = [int(st), int(et)]
      perma_offsets.append(obj2)




    latest = 0
    for t in requestTasks:
      dd = t["dueDate"] - since_epoch
      adjustedTask = Task(t["duration"], int(dd / 60 // 30) , t["taskName"], int(t["preference"]))
      print("Due Date: " + str(dd))
      tasks.append(adjustedTask)

      if dd > latest:
        latest = dd

        print("latest")
    print(latest)
    latest = latest / 60 // 30
    print(latest)

    schedule = [0] * int(latest)

    print("stime: " + str(stime));
    print("etime: " + str(etime));
    for days in range(len(schedule) // 48):
      for interval in range(days * 48 + stime, min(len(schedule), days * 48 + etime)):
        #print('hit')
        schedule[interval] = Block(True, "mandatory", interval, 0)

    for obj in perma_offsets:
      for interval in range(obj[0], obj[1]):
        if(interval < len(schedule)):
            schedule[interval] = Block(True, "mandatory", interval, 0)

    print(schedule)




    print("about to start state")

    start = start_state(tasks, schedule)
    #print_schedule(start.schedule)
    print(start)
    result = astar(start, neighbors, heuristic)
    #print_schedule(result.schedule)
    print(result)

    return jsonify(result)
    #result is the scheduled events


if __name__ == '__main__':
    app.run(debug=True)


#jason = 0
#with open('task.json') as json_data:
#  jason = json.load(json_data)
#  for entry in jason['tasks']:
#    tasks.append(entry)
