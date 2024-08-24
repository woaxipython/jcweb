
class ChangeBrand {
    constructor() {
        this.russianChars = ['Б', 'Г', 'Д', 'З', 'И', 'Л', 'М', 'Н', 'О', 'П', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ъ', 'Ь', 'Э'];
        this.arabicChars = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
        this.spanishChars = ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', 'á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'Ñ'];
        this.allChars = this.russianChars.concat(this.arabicChars, this.spanishChars);
    }

    change(inputStr) {
        const inputStrUpper = inputStr.toUpperCase();
        let brand, newBrand;

        if (inputStr.includes("万明")) {
            brand = "万明";
            newBrand = this.obfuscateStringZh(brand);
        } else if (inputStr.includes("梦子沫")) {
            brand = "梦子沫";
            newBrand = this.obfuscateStringZh(brand);
        } else if (inputStr.includes("北思沫")) {
            brand = "北思沫";
            newBrand = this.obfuscateStringZh(brand);
        } else if (inputStrUpper.includes("MYDCT")) {
            brand = "MYDCT";
            newBrand = this.obfuscateStringEn(brand);
        } else if (inputStrUpper.includes("VBFG")) {
            brand = "VBFG";
            newBrand = this.obfuscateStringEn(brand);
        } else if (inputStrUpper.includes("PESGE")) {
            brand = "PESGE";
            newBrand = this.obfuscateStringEn(brand);
        } else {
            brand = "万明";
            newBrand = this.obfuscateStringZh(brand);
        }
        return inputStrUpper.replace(brand, newBrand);
    }

    obfuscateStringEn(brand) {
        const charMap = {
            'A': ['𝐴', '𝑨', 'Ａ', 'А'],
            'B': ['𝐵', '𝑩', 'Ｂ', 'В'],
            'C': ['𝐶', '𝑪', 'Ｃ', 'С'],
            'D': ['𝐷', '𝑫', 'Ｄ'],
            'E': ['𝐸', '𝑬', 'Ｅ', 'Е'],
            'F': ['𝐹', '𝑭', 'Ｆ'],
            'G': ['𝐺', '𝑮', 'Ｇ'],
            'H': ['𝐻', '𝑯', 'Ｈ'],
            'I': ['𝐼', '𝑰', 'Ｉ'],
            'J': ['𝐽', '𝑱', 'Ｊ'],
            'K': ['𝐾', '𝑲', 'Ｋ'],
            'L': ['𝐿', '𝑳', 'Ｌ'],
            'M': ['𝑀', '𝑴', 'Ｍ', 'М'],
            'N': ['𝑁', '𝑵', 'Ｎ'],
            'O': ['𝑂', '𝑶', 'Ｏ'],
            'P': ['𝑃', '𝑷', 'Ｐ', 'Р'],
            'Q': ['𝑄', '𝑸', 'Ｑ'],
            'R': ['𝑅', '𝑹', 'Ｒ'],
            'S': ['𝑆', '𝑺', 'Ｓ'],
            'T': ['𝑇', '𝑻', 'Ｔ', 'Т'],
            'U': ['𝑈', '𝑼', 'Ｕ'],
            'V': ['𝑉', '𝑽', 'Ｖ'],
            'W': ['𝑊', '𝑾', 'Ｗ'],
            'X': ['𝑋', '𝑿', 'Ｘ'],
            'Y': ['𝒴', '𝓨', 'Ｙ', 'У'],
            'Z': ['𝑍', '𝒁', 'Ｚ']
        };

        return Array.from(brand).map(char => {
            const options = charMap[char.toUpperCase()] || [char];
            return options[Math.floor(Math.random() * options.length)];
        }).join('');
    }

    obfuscateStringZh(brand) {
        const insertStr = this.allChars[Math.floor(Math.random() * this.allChars.length)];
        let strList = Array.from(brand);
        if (strList.length > 1) {
            const randomIndex = Math.floor(Math.random() * (strList.length - 1)) + 1;
            strList.splice(randomIndex, 0, insertStr);
        }
        return strList.join('');
    }
}

function changeBrand(){
    const change = new ChangeBrand();
    const $input = $('input[name="change_brand_input"]')
    const val = $input.val();
    if (val.length > 0) {
        const str = $input.val().toUpperCase();
        $input.val(change.change(str));
    }else{
        alert("请输入要转换的文字");
    }
}

function handleFileUpload(element, inputName, callback) {
    const fileInput = $(`input[name="${inputName}"]`)[0];
    const file = fileInput.files[0];
    const button = $(element);

    button.prop('disabled', true).text('等待中...');

    if (!file) {
        console.error("未选择文件");
        resetButton(button);
        return;
    }

    readExcelFromFile(file).then(json => {
        if (callback(json)) {
            resetButton(button);
        }
    }).catch(error => {
        console.error("读取文件出错", error);
        resetButton(button);
    });
}


function resetButton(button) {
    button.prop('disabled', false).text('上传文件');
}

function validateExcelFormat(json, maxRows, headers) {
    if (!headers.every((header, index) => json[0][index] === header)) {
        alert("文件格式首行错误，请检查导入模板是否错误");
        return false;
    }

    if (json.length > maxRows) {
        alert(`单次导入长度超过${maxRows}，为避免占用服务器资源，请分批导入或删除已导入的数据`);
        return false;
    }

    for (let i = 1; i < json.length; i++) {
        if (json[i].length !== headers.length) {
            alert(`第${i + 1}行数据错误，可能出现空值，请检查后重新导入`);
            return false;
        }
        for (let j = 0; j < json[i].length; j++) {
            if (json[i][j] === "") {
                alert(`${i + 1}行${j + 1}列为空值`);
                return false;
            }
        }
    }
    return true;
}

function outExlsx(data, name) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${name}.xlsx`);
}

function changeBrandFile(element) {
    handleFileUpload(element, 'changeBrandFile', json => {
        if (!validateExcelFormat(json, 500, ["序号", "链接", "内容"])) {
            return false;
        }

        const change = new ChangeBrand();
        json.forEach((row, index) => {
            if (index > 0) {
                row[2] = change.change(row[2]);
            }
        });

        outExlsx(json, '评论内容导出');
        return true;
    });
}


function InputChangeBrand() {
    const data = [['序号', '链接', '内容']];
    outExlsx(data, '导入模板');
}

function readExcelFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: true});
            const filteredJson = json.filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ""));
            resolve(filteredJson);
        };

        reader.onerror = function (e) {
            reject(e.target.error);
        };

        if (file instanceof File) {
            reader.readAsArrayBuffer(file);
        } else {
            reject(new Error("传入的不是文件对象"));
        }
    });
}
