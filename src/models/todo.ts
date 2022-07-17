export class Todo {
  id: string;
  message: string;

  constructor(params: Todo) {
    this.id = params.id;
    this.message = params.message;
  }
}
