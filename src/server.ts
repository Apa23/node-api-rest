import restify from 'restify';
import morgan from 'morgan';
import bunyan from 'bunyan';

// Se crea el server
const server = restify.createServer({
  name: process.env.API_NAME,
  log: bunyan.createLogger({
    name: 'audit',
    level: 'error',
  }),
});

server.use(morgan('dev'));

// Se crea una archivo con el nombre recibido por params
const intrectingWithOS = (fileName: string) =>
  new Promise((resolve, reject) => {
    const { spawn } = require('node:child_process');
    const ls = spawn('touch', [fileName]);

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(`Resolution code ->>> ${code}`);
    });
  });

// Se convierte un archivo mp4 con el nombre recibido por params a webm
const convertMP4ToWEBM = (fileName: string) =>
  new Promise((resolve, reject) => {
    const { spawn } = require('node:child_process');
    // flags: -y sobreesrcribe los archivos, -i nombre del archivo a convertir
    // env: { PATH: url donde se encuentren los exe de ffmpeg }
    const ffmpeg = spawn('ffmpeg', ['-y', '-i', `${fileName}.mp4`, `${fileName}-converted.webm`], { env: { PATH: 'C:/ffmpeg/bin' } });

    ffmpeg.on('error', (err) => {
      console.error('Failed to start subprocess.', err);
    });

    ffmpeg.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(`Resolution code ->>> ${code}`);
    });
  });

// Se convierte un archivo webm con el nombre recibido por params a mp4
const convertWEBMtoMP4 = (fileName: string) =>
  new Promise((resolve, reject) => {
    const { spawn } = require('node:child_process');
    // flags: -y sobreesrcribe los archivos, -i nombre del archivo a convertir
    // env: { PATH: url donde se encuentren los exe de ffmpeg }
    const ffmpeg = spawn('ffmpeg', ['-y', '-i', `${fileName}.webm`, `${fileName}-converted.mp4`], { env: { PATH: 'C:/ffmpeg/bin' } });

    ffmpeg.on('error', (err) => {
      console.error('Failed to start subprocess.', err);
    });

    ffmpeg.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(`Resolution code ->>> ${code}`);
    });
  });

// Mutea los videos con el nombre recibido por params
const muteVideos = (fileName: string) =>
  new Promise((resolve, reject) => {
    const { spawn } = require('node:child_process');
    // flags: -y sobreesrcribe los archivos, -i nombre del archivo a convertir, -an mutea el archivo resultante, -c selecciona el encoder
    // env: { PATH: url donde se encuentren los exe de ffmpeg }
    const ffmpeg1 = spawn('ffmpeg', ['-y', '-i', `${fileName}.mp4`, '-c', 'copy', '-an', `${fileName}-muted.mp4`], { env: { PATH: 'C:/ffmpeg/bin' } });
    const ffmpeg2 = spawn('ffmpeg', ['-y', '-i', `${fileName}.webm`, '-c', 'copy', '-an', `${fileName}-muted.webm`], { env: { PATH: 'C:/ffmpeg/bin' } });

    ffmpeg1.on('error', (err) => {
      console.error('Failed to start subprocess.', err);
    });

    ffmpeg1.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpeg1.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg1.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(`Resolution code ->>> ${code}`);
    });

    ffmpeg2.on('error', (err) => {
      console.error('Failed to start subprocess.', err);
    });

    ffmpeg2.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpeg2.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg2.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(`Resolution code ->>> ${code}`);
    });
  });

// Petición al server para crear archivo con nombre :name
server.get('/hello/:name', async (req, rest) => {
  try {
    const response = await intrectingWithOS(req?.params?.name);

    return rest.json({
      message: 'hello',
      name: req?.params?.name,
      codeMessage: response,
    });
  } catch (error) {
    console.log(error?.stack);
    console.log(error);
    return rest.json({
      mesage: error?.message,
      error: true,
    });
  }
});

// Petición al server para convertir a mp4 archivo webm con nombre :name
server.get('/api/v1/transform/webmtomp4/:name', async (req, rest) => {
  const response = await convertWEBMtoMP4(req?.params?.name);
  try {
    return rest.json({
      message: 'webmtomp4',
      codeMessage: response,
    });
  } catch (error) {
    console.log(error?.stack);
    console.log(error);
    return rest.json({
      mesage: error?.message,
      error: true,
    });
  }
});

// Petición al server para convertir a webm archivo mp4 con nombre :name
server.get('/api/v1/transform/mp4towebm/:name', async (req, rest) => {
  const response = await convertMP4ToWEBM(req?.params?.name);
  try {
    return rest.json({
      message: 'mp4towebm',
      codeMessage: response,
    });
  } catch (error) {
    console.log(error?.stack);
    console.log(error);
    return rest.json({
      mesage: error?.message,
      error: true,
    });
  }
});

// Petición al server para mutear los archivo con nombre :name
server.get('/api/v1/transform/mutevideos/:name', async (req, rest) => {
  const response = await muteVideos(req?.params?.name);
  try {
    return rest.json({
      message: 'mutevideos',
      codeMessage: response,
    });
  } catch (error) {
    console.log(error?.stack);
    console.log(error);
    return rest.json({
      mesage: error?.message,
      error: true,
    });
  }
});

// se ejecuta la conexión al server
const executeMainServer = async () => {
  console.log('🚀 ~ file: server.ts:22 ~ server.listen ~ process.env.SERVER_PORT:', process.env.SERVER_PORT);
  server.listen(process.env.SERVER_PORT || 8000, () => {
    console.log('%s listening at port %s', server.name, server.url);
  });
};

export { executeMainServer };
