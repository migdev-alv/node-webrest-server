import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

export class TodosController {

    //* DI
    constructor() {

    }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(Number(id))) return res.status(400).json({ message: 'Invalid id' });

        const todo = await prisma.todo.findUnique({
            where: {
                id: Number(id),
            }
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        return res.json(todo);
    }

    public createTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);

        if (error) return res.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: createTodoDto!,
        })

        res.json(todo);
    }

    public updateTodo = async (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        const todo = await prisma.todo.findFirst({
            where: {
                id: Number(id),
            }
        });

        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        const updateTodo = await prisma.todo.update({
            where: {
                id: Number(id),
            },
            data: updateTodoDto!.values,
        });

        res.json(updateTodo);
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (isNaN(Number(id))) return res.status(400).json({ message: 'Invalid id' });

        const deleteTodo = await prisma.todo.delete({
            where: {
                id: Number(id),
            }
        })

        //if (!deleteTodo) return res.status(404).json({ message: 'Todo not found' });

        //todos.splice(todos.indexOf(todo), 1);
        res.json(deleteTodo);
    }

}