import { Request, Response } from "express";

const todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date() },
    { id: 2, text: 'Do homework', completedAt: new Date() },
    { id: 3, text: 'Go to the gym', completedAt: null },
];

export class TodosController {

    //* DI
    constructor() {

    }

    public getTodos = (req: Request, res: Response) => {
        return res.json(todos);
    }

    public getTodoById = (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(Number(id))) return res.status(400).json({ message: 'Invalid id' });
        const todo = todos.find(todo => todo.id === Number(id));
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        return res.json(todo);
    }

    public createTodo = (req: Request, res: Response) => {

        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text property is required' });

        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: new Date(),
        };

        todos.push(newTodo);
        res.json(newTodo)
    }

    public updateTodo = (req: Request, res: Response) => {
        const { id } = req.params;
        const { text, completedAt } = req.body;

        if (isNaN(Number(id))) return res.status(400).json({ message: 'Invalid id' });
        //if (!text) return res.status(400).json({ message: 'Text property is required' });

        const todo = todos.find(todo => todo.id === Number(id));
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.text = text || todo.text;
        (completedAt === 'null')
            ? todo.completedAt = null
            : todo.completedAt = new Date(completedAt) || todo.completedAt;

        res.json(todo);
    }

    public deleteTodo = (req: Request, res: Response) => {
        const { id } = req.params;

        if (isNaN(Number(id))) return res.status(400).json({ message: 'Invalid id' });

        const todo = todos.find(todo => todo.id === Number(id));
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        todos.splice(todos.indexOf(todo), 1);
        res.json(todo);
    }

}