export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
};

export type List = {
  id: string;
  title: string;
  tasks: Task[];
};
