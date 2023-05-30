const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'thaisanobrega.com@gmail.com',
        pass: 'wircmzbszlpjowdu'
    }
});

function sendMail(form, res){
    transport.sendMail({
        from: `${form.from}`,
        to: 'thaisanobrega.com@gmail.com',
        subject: `Quero um orçamento!`,
        html: `
            <h1>Empresa: ${form.entrepriseName}</h1>
            <p>Responsável: ${form.responsableName}</p>
            <p>Telefone: ${form.phone}</p>
            <p>De: ${form.from}</p>
        `
    })
    .then(() => res.send("Email sent"))
    .catch((err) => console.log(err))
}

module.exports = {
    sendMail
}