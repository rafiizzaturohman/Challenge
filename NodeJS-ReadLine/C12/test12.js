if (!process.argv[2]) {
    console.log('Tolong sertakan inputan soalnya\n Misalnya \'node test12.js data.json\'')
    process.exit(0);
}

const fs = require('fs');
const readline = require('readline');

let file = fs.readFileSync(process.argv[2], "utf-8")
let data = JSON.parse(file)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Tebakanmu > '
});

console.log(`Hey, yo! Selamat datang di uji pengetahuan tentang sejarah bangsa Indonesia! Kamu akan diberikan pertanyaan dari file ini \'soal.json atau math.json\'
Jawablah dengan jawaban yang tepat.\n
Gunakan \'skip\' untuk menangguhkan pertanyaannya dan di akhir pertanyaan yang kamu skip akan ditanyakan kembali.
`);

let count = 0;
let wrong = 0

console.log(`Pertanyaan : ${data[count].definition}`);
rl.prompt();

rl.on('line', line => {
    if (count < data.length - 1) {
        if (line.toLowerCase() !== 'skip') {
            if (line.toLowerCase() !== data[count].term) {
                wrong++
                console.log(`Wkwkwwkwk, jawabanmu kurang tepat! Kamu telah salah menjawab pertanyaan ini sebanyak ${wrong}. Coba lagi yaw!`)
                rl.prompt()
            } else {
                count++
                console.log('Nice, jawabanmu benar!\n')
                console.log(`Pertanyaan: ${data[count].definition}`)
                rl.prompt()
            }
        } else if (line.toLowerCase() === 'skip') {
            data.push(data[count])
            wrong = 0
            count++
            console.log(`Pertanyaan: ${data[count].definition}`)
            rl.prompt()
        }
    } else if (line.toLowerCase() !== data[count].term) {
        wrong = 0
        wrong++
        console.log(`Wkwkwwkwk, jawabanmu kurang tepat! Kamu telah salah menjawab pertanyaan ini sebanyak ${wrong}. Coba lagi yaw!`)
        rl.prompt()
    } else {
        console.log('Nice, jawabanmu benar!\n')
        console.log('Yow mantap, kamu menang quiz nya :D\n')
        process.exit(0)
    }
    rl.prompt();
}).on('close', () => {
    console.log('Dadah xD');
    process.exit(0);
});