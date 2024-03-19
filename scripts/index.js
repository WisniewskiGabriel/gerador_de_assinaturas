document.getElementById("hasCorporatePhone").addEventListener('change', function () {

    if (document.getElementById("hasCorporatePhone").checked) {
        actionForHasCorporatePhoneTrue();
    } else {
        actionForHasCorporatePhoneFalse();
    }
})

document.getElementById("generate_button").addEventListener('click', function () {
    if (checkFields()) {
        generateSignature();
    } else {window.alert("Preencha todos os campos")}
})

function isCheckboxChecked() {
    return document.getElementById("hasCorporatePhone").checked;
}

function addCorporateInfoField() {
    document.getElementById("form-data").insertAdjacentHTML("beforeend", '<div class="col-sm-12" id="field_corporate_phone"></br><label for="colabCorporatePhone" class="form-label">Telefone corporativo<span class="text-muted"> CELULAR CORPORATIVO (quando existir) / VoIP</span></label><input type="text" class="form-control" id="colabCorporatePhone" placeholder="" value="" required></div>')
}

function actionForHasCorporatePhoneTrue() {
    addCorporateInfoField();
    document.getElementById("hasCorporatePhone").checked = true;
}

function actionForHasCorporatePhoneFalse() {
    document.getElementById("form-data").removeChild(document.getElementById("field_corporate_phone"));
    document.getElementById("hasCorporatePhone").checked = false;
}

function generateZip(str_htm, str_nome_colab) {
    const zip = new JSZip();

    // Add the HTML file
    zip.file("assinatura_template_(mail_colab).htm", str_htm);

    // Fetch the PNG image file
    fetch('./assets/assinatura_template_(mail_colab)_arquivos/image001.png')
        .then(response => response.blob())
        .then(imageBlob => {
            // Add the PNG image file to the zip
            zip.file('assinatura_template_(mail_colab)_arquivos/image001.png', imageBlob, { binary: true });

            // Generate the zip file asynchronously
            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    // Create a download link
                    var link = document.createElement("a");
                    link.href = URL.createObjectURL(content);
                    var currentDate = new Date();
                    link.download = "Assinatura de " + str_nome_colab + " gerado em " + currentDate.getFullYear() + "-" + (Number(currentDate.getMonth()) + 1) + "-" + currentDate.getDate() + ".zip";
                    link.click();
                });
        });
}

async function fetchSignature() {
    const response = await fetch("./assets/assinatura_template(colab_mail).htm");
    const text = await response.text();
    return text;
}

async function awaitSignature() {
    const signature = await fetchSignature();
    return signature;
}

async function getStrOfSignature() {
    let str_signature = await awaitSignature();
    return str_signature;
}

function getDataFromForm() {


    let bool_has_corporate_phone = document.getElementById("hasCorporatePhone").checked;
    let str_telefone_colab = ""
    if (bool_has_corporate_phone) {
        str_telefone_colab = document.getElementById("colabCorporatePhone").value
    }

    let objData = {
        nome_colab: document.getElementById("colabName").value,
        mail_colab: document.getElementById("email").value,
        cargo_colab: document.getElementById("colabPosition").value,
        gerencia_colab: document.getElementById("colabSector").value,
        cidade_colab: document.getElementById("colabCity").value,
        has_corporate_phone: bool_has_corporate_phone,
        telefone_colab: str_telefone_colab
    }

    return objData;
}

async function generateSignature() {

    let str_signature = await getStrOfSignature(); // Await the result here
    objData = getDataFromForm();

    str_signature = String(str_signature).replace(/nome_colab/g, objData.nome_colab);
    //str_signature = str_signature.replace(/mail_colab/g, objData.mail_colab);
    str_signature = str_signature.replace(/cargo_colab/g, objData.cargo_colab);
    str_signature = str_signature.replace(/gerencia_colab/g, objData.gerencia_colab);
    str_signature = str_signature.replace(/cidade_colab/g, objData.cidade_colab);
    str_signature = str_signature.replace(/_telefone_colab_/g, objData.telefone_colab);

    generateZip(str_signature, objData.nome_colab)

}

function checkFields() {
    objData = getDataFromForm();

    if (!objData.nome_colab.length > 0 |
        !objData.mail_colab.length > 0 |
        !objData.cargo_colab.length > 0 |
        !objData.gerencia_colab.length > 0 |
        !objData.cidade_colab.length > 0 |
        (objData.has_corporate_phone && !objData.telefone_colab.length>0)) {
        return false;
    } else {
        return true;
    }

}