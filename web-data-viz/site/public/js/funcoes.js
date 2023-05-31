
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        b_usuario.innerHTML = nome;
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../index.html";
}

function sendMail() {
    var email = input_email.value;
    var telefone = input_telefone.value;
    var empresa = input_empresa.value;
    var responsavel = input_responsavel.value;
    var form = {
        from: email,
        entrepriseName: empresa,
        responsableName: responsavel,
        phone: telefone
    }
    fetch('/email/sendmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
        .then(() => alert("E-mail enviado com sucesso"))
        .catch(() => alert("Error para enviar o email"));
}