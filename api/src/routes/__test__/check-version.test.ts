import { app } from "../../app";
import request from 'supertest';
import { natsWrapper } from "../../nats-wrapper";

it('has a route handler listening to /api/checkVersion for post requests', async () => {
    const response = await request(app)
        .post('/api/checkVersion')
        .send({});
    expect(response.status).not.toEqual(404);
});

it('returns error if provider is empty', async () => {
    const response = await request(app)
        .post('/api/checkVersion')
        .send({
            repoName: "hkaankarakoc/docker-react",
            emailList: ["test@test.com"]
        });

    expect(response.status).toEqual(400);
});

it('returns error if repoName is empty', async () => {
    const response = await request(app)
        .post('/api/checkVersion')
        .send({
            provider: 'github',
            emailList: ["test@test.com"]
        });

    expect(response.status).toEqual(400);
});

it('returns error if emailList is empty', async () => {
    const response = await request(app)
        .post('/api/checkVersion')
        .send({
            provider: 'github',
            repoName: 'hkaankarakoc/docker-react',
            emailList: []
        });

    expect(response.status).toEqual(400);
});


it('returns error if emailList elements is not an email', async () => {
    const response = await request(app)
        .post('/api/checkVersion')
        .send({
            provider: 'github',
            repoName: "hkaankarakoc/docker-react",
            emailList: []
        });

    expect(response.status).toEqual(400);
});


it('publishes an event', async () => {
    const response = await request(app)
        .post('/api/checkVersion')
        .send({
            provider: 'github',
            repoName: 'hkaankarakoc/docker-react',
            emailList: ['test@test.com']
        });
    expect(response.status).toEqual(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});