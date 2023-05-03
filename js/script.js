function verificarCertificado() {
    const codigo = document.getElementById("codigo").value
        .trim(); // Obter o valor do campo de entrada de texto e remover os espaços em branco

    // Fazer a requisição para o arquivo certificados.txt
    const request = new XMLHttpRequest();
    request.open("GET", "certificados.txt");
    request.send();
    request.onload = function () {
        const certificados = request.responseText.split("\n"); // Dividir as linhas do arquivo em um array

        // Percorrer o array de certificados em busca do código SHA-256
        let encontrado = false;
        let nome, curso, conclusao;
        for (let i = 0; i < certificados.length; i++) {
            const certificado = certificados[i].split(","); // Dividir as informações da linha em um array
            if (certificado[0].toLowerCase() === codigo
                .toLowerCase()
            ) { // Verificar se o código SHA-256 foi encontrado, ignorando a diferença de maiúsculas e minúsculas
                encontrado = true;
                nome = certificado[1];
                curso = certificado[2];
                conclusao = certificado[3];
                break;
            }
        }

        // Exibir o resultado da verificação na página
        const resultado = document.getElementById("resultado");
        if (encontrado) {
            resultado.innerHTML =
                `<i class="fas fa-check-circle"></i> Parabéns, ${nome}, seu certificado do curso ${curso} é válido, e foi emitido em ${conclusao}`;
            resultado.classList.remove("text-red-500");
            resultado.classList.add("text-green-500");
        } else {
            resultado.innerHTML =
                `<i class="fas fa-times-circle"></i> Infelizmente nenhum certificado foi encontrado para o código digitado. Verifique se o código foi inserido corretamente e tente novamente`;
            resultado.classList.remove("text-green-500");
            resultado.classList.add("text-red-500");
        }
    };
}