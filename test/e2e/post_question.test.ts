import fetch from 'node-fetch';

const questionApi = 'https://bmgnrlidae.execute-api.eu-west-1.amazonaws.com';

describe('Post question', () => {
  it('should post question', async () => {
    const response = await fetch(`${questionApi}/question`, {
      method: 'POST',
      body: JSON.stringify({question: 'What is Fastweb?'}),
    });
    expect(response.status).toBe(200);
    expect(response.json()).toBeDefined();
    console.log(response.json());
  });
});
