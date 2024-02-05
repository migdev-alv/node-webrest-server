import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

export class TodosController {

    //* DI
    constructor(
        private readonly todoRepository: TodoRepository,
    ) {

    }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        //console.log(todos);
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(Number(id))) return res.status(400).json({ message: 'Invalid id' });

        try {
            const todo = await this.todoRepository.findById(Number(id));
            res.json(todo);
        } catch (error) {
            res.status(400).json({ error });
        }

    }

    public createTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);

        if (error) return res.status(400).json({ error });

        const todo = await this.todoRepository.create(createTodoDto!);
        res.json(todo);
    }

    public updateTodo = async (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id: Number(id) });
        if (error) return res.status(400).json({ error });

        const todo = await this.todoRepository.updateById(updateTodoDto!);
        return res.json(todo);
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (isNaN(Number(id))) return res.status(400).json({ message: 'Invalid id' });

        try {
            const todo = await this.todoRepository.deleteById(Number(id));
            return res.json(todo);
        } catch (error) {
            res.status(400).json({ error });
        }

    }

}