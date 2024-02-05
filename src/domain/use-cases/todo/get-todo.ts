import { CreateTodoDto } from "../../dtos";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repository";

export interface GetTodoUseCase {
    execute(id: number): Promise<TodoEntity | null>
}

export class GetTodo implements GetTodoUseCase {
    constructor(
        private readonly todoRepository: TodoRepository,
    ) { }

    async execute(id: number): Promise<TodoEntity | null> {
        return await this.todoRepository.findById(id);
    }
}