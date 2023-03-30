import axios from 'axios'
import * as dotenv from 'dotenv'
import fs from 'fs'
import { Configuration, OpenAIApi } from 'openai'
dotenv.config()

const apiKey = process.env.OPENAI_KEY

const config = new Configuration({
  apiKey: apiKey
})

async function geraGPT() {
  try {

    const prompt = fs.readFileSync('./prompt.txt', 'utf8')
    const openai = new OpenAIApi(config)

    const img = String(prompt).toLocaleLowerCase().includes('gerar imagem')

    if (img) {

      console.log('Gerando imagem...')

      const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "512x512",
      });
      const fileName = './exemplo.jpg'

      axios({
        method: 'get',
        url: response!.data!.data[0].url!,
        responseType: 'stream'
      })
        .then(function (response) {

          const writer = fs.createWriteStream(fileName);

          response.data.pipe(writer);

        })

        .catch(function (err) {
          console.error(`Erro ao fazer requisição HTTP: ${err}`);
        });


    } else {
      console.log('Gerando texto...')
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        max_tokens: 2048
      })

      fs.createWriteStream('./exemplo.txt', 'utf-8').write(response.data.choices[0].text)
    }

  } catch (error: any) {
    console.log(error?.response.data)
  }
}


export default geraGPT