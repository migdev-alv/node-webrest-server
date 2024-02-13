import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Testing todos routes', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    })

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    });

    const todo1 = {
        text: 'Hola Mundo 1',
    };
    const todo2 = {
        text: 'Hola Mundo 2',
    };

    test('should get all todos', async () => {

        //await prisma.todo.deleteMany();
        await prisma.todo.createMany({ data: [todo1, todo2] });

        const { body } = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);
    });

    test('should return a TODO by id', async () => {
        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request(testServer.app)
            .get(`/api/todos/${todo.id}`)
            .expect(200);

        //console.log(body);

        expect(body).toEqual({
            id: todo.id,
            text: todo.text,
            //completedAt: null,
        });
    });

    test('should return 404 when TODO not found', async () => {
        const { body } = await request(testServer.app)
            .get('/api/todos/99999')
            .expect(404);

        expect(body).toEqual({ error: 'Todo with id 99999 not found' });
    });

    test('should create a TODO', async () => {
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send(todo1)
            .expect(201);

        expect(body).toEqual({
            id: expect.any(Number),
            text: 'Hola Mundo 1',
            //completedAt: null,
        });
    });

    test('should return 400 when invalid TODO', async () => {
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({})
            .expect(400);

        expect(body).toEqual({ error: 'Text property is required' });
    });

    test('should update a TODO', async () => {
        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({ text: 'Hola Mundo 1 Updated', completedAt: '2024-02-13' })
            .expect(200);

        expect(body).toEqual({
            id: todo.id,
            text: 'Hola Mundo 1 Updated',
            completedAt: "2024-02-13T00:00:00.000Z",
        });
    });

    test('should return 400 when TODO not found to update', async () => {
        const { body } = await request(testServer.app)
            .put('/api/todos/99999')
            .send({ text: 'Hola Mundo 1 Updated' })
            .expect(404);

        expect(body).toEqual({ error: 'Todo with id 99999 not found' });
    });

    test('should only update date when completedAt is sent', async () => {
        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({ completedAt: '2024-02-13' })
            .expect(200);

        expect(body).toEqual({
            id: todo.id,
            text: todo.text,
            completedAt: "2024-02-13T00:00:00.000Z",
        });
    });

    test('should delete a TODO', async () => {
        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request(testServer.app)
            .delete(`/api/todos/${todo.id}`)
            .expect(200);

        const todos = await prisma.todo.findUnique({ where: { id: todo.id } });
        expect(todos).toBeNull();
        expect(body).toEqual({
            id: todo.id,
            text: todo.text,
        });
    });

    test('should return 404 when TODO not found to delete', async () => {
        const { body } = await request(testServer.app)
            .delete('/api/todos/99999')
            .expect(404);

        expect(body).toEqual({ error: 'Todo with id 99999 not found' });
    });

});