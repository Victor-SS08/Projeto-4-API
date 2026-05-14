//DECLARAÇÕES DOS ELEMENTOS HTML PARA O DOM
const videoelement = document.getElementById("video");
const botaoscan = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//MÉTODO LIGAR CÂMERA

async function configurarCamera() {
    try {
        const midia = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }, 
            audio: false
        });
        videoelement.srcObject = midia;
        //garantir que o vídeo comece a tocar
        videoelement.play();
    } catch (erro) {
        resultado.innerText = "Erro ao acessar a câmera: " + erro.message;
    }
}
//executa a função para habilitar a camera
configurarcamera();

//CAPTURAR E LER O TEXTO
botaoscan.onclick =async()=>{
    //DESATIVA O BOTAO PARA EVITAR MTO CLIQUE 
    botaoscan.disabled = true;
    resultado.innerText = "fazendo leitura, aguarde..."

    //captura a imagem (foto)
    const contexo = canvas.getContext("2d");

    //ajusta o tamanho do canvas, interno para ser igual o do video
    canvas.width = videoelement.videoWidth;
    canvas.height = videoelement.videoHeight;

    contexto.setTransform(1,0,0,1,0,0);
    context.filter = 'contrast(1.2) grayscale(1)';

    //desenha o frame atual do video dentro do canvas(tira a foto)
    contexto.drawImage(videoelement,0,0,canvas,canvas.height);

    //processando com a api Tesseract
    try{
        //funcao do tesseract
        const {data:{text}} = await Tesseract.recognize(
            canvas, //a img que acabou de capturar
            "por", //idioma:portugues
            {looger: m=>console.log(m)} //show on log
        )
        resultado.innerText = text.trim().length > 0 ? text:"não foi possivel identificar o texto"
    }catch(erro){
        //resultado caso apresente erro
        resultado.innerText="Erro no processamento", erro.message;
    }
    finally{
        //habilita o botao para uma nova leitura
        botaoscan.disabled=false;
    }
}