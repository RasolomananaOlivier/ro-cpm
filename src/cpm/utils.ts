import { Event, Task } from "./data";

/**
 * Performs a topological sort on the events graph using Kahn's algorithm.
 *
 * @param events - A mapping of event id to Event.
 * @param tasks - An array of Task objects.
 * @returns An array of event IDs in topologically sorted order.
 * @throws An error if the graph is not acyclic.
 */
function topologicalSort(
  events: Record<string, Event>,
  tasks: Task[]
): string[] {
  // Compute indegree for each event based on its incoming tasks.
  const indegree: Record<string, number> = {};
  for (const eventId in events) {
    indegree[eventId] = events[eventId].incoming.length;
  }

  // Initialize the queue with events that have no incoming tasks.
  const queue: string[] = [];
  for (const eventId in indegree) {
    if (indegree[eventId] === 0) {
      queue.push(eventId);
    }
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const currentEventId = queue.shift()!;
    sorted.push(currentEventId);

    // For each outgoing task from the current event,
    // reduce the indegree of the target event.
    for (const taskId of events[currentEventId].outgoing) {
      // Retrieve the task by its ID.
      const task = tasks.find((t) => t.id === taskId);
      if (!task) continue;
      const targetEventId = task.endEvent;
      indegree[targetEventId]--;
      if (indegree[targetEventId] === 0) {
        queue.push(targetEventId);
      }
    }
  }

  // If we did not process all events, there is a cycle or missing event.
  if (sorted.length !== Object.keys(events).length) {
    throw new Error("Graph has at least one cycle or some events are missing.");
  }

  return sorted;
}

/**
 * Computes the Critical Path Method (CPM) values for events and tasks.
 *
 * @param events - A mapping of event id to Event data.
 * @param tasks - An array of Task objects.
 * @returns An object containing the updated events and tasks.
 */
export function computeCPM(
  events: Record<string, Event>,
  tasks: Task[]
): { events: Record<string, Event>; tasks: Task[] } {
  // 1. Topologically sort the events.
  const sortedEvents: string[] = topologicalSort(events, tasks);

  // 2. Forward pass: calculate earliest times.
  sortedEvents.forEach((eventId) => {
    const event = events[eventId];
    event.outgoing.forEach((taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error(`Task with id ${taskId} not found.`);
      }
      const finishTime = event.earliestTime + task.duration;
      const targetEvent = events[task.endEvent];
      targetEvent.earliestTime = Math.max(
        targetEvent.earliestTime || 0,
        finishTime
      );
    });
  });

  // Backward pass: calculate latest times.

  // 1. Initialize all events' latestTime to Infinity.
  Object.keys(events).forEach((eventId) => {
    events[eventId].latestTime = Infinity;
  });

  // 2. For each sink event (with no outgoing tasks), set its latestTime to its earliestTime.
  Object.keys(events).forEach((eventId) => {
    if (events[eventId].outgoing.length === 0) {
      events[eventId].latestTime = events[eventId].earliestTime;
    }
  });

  // 3. Process events in reverse topological order.
  const reversedEvents = sortedEvents.slice().reverse();
  reversedEvents.forEach((eventId) => {
    const event = events[eventId];
    event.incoming.forEach((taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error(`Task with id ${taskId} not found.`);
      }
      // Candidate latest time for the start event of this task.
      const candidateLatest = event.latestTime - task.duration;
      const sourceEvent = events[task.startEvent];
      sourceEvent.latestTime = Math.min(
        sourceEvent.latestTime,
        candidateLatest
      );
    });
  });

  // 4. Slack calculation: determine the slack for each task.
  tasks.forEach((task) => {
    const start = events[task.startEvent];
    const finish = events[task.endEvent];
    task.slack = finish.latestTime - (start.earliestTime + task.duration);
  });

  return { events, tasks };
}
