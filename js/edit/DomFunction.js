class ChangeBrand {
    constructor() {
        this.chars = {
            arabic: ['أ', 'ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'ق', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
            invisible: ['Í', 'í'],
            cyrillic: {
                'A': 'А', 'B': 'В', 'C': 'С', 'D': 'D', 'E': 'Е',
                'F': 'F', 'G': 'G', 'H': 'Н', 'I': 'И', 'J': 'Ј',
                'K': 'К', 'L': 'Л', 'M': 'М', 'N': 'Н', 'O': 'О',
                'P': 'Р', 'Q': 'Q', 'R': 'R', 'S': 'Ѕ', 'T': 'Т',
                'U': 'Ц', 'V': 'V', 'W': 'Ш', 'X': 'Х', 'Y': 'Ү', 'Z': 'З',
                'a': 'а', 'b': 'Ь', 'c': 'с', 'd': 'ԁ', 'e': 'е',
                'f': 'ғ', 'g': 'ԍ', 'h': 'һ', 'i': 'і', 'j': 'ј',
                'k': 'қ', 'l': 'ӏ', 'm': 'м', 'n': 'п', 'o': 'о',
                'p': 'р', 'q': 'ԛ', 'r': 'г', 's': 'ѕ', 't': 'т',
                'u': 'ц', 'v': 'ѵ', 'w': 'ԝ', 'x': 'х', 'y': 'у', 'z': 'ᴢ'
            }
        };
        this.allChars = [...this.chars.arabic, ...this.chars.invisible];
    }

    replaceWithCyrillic(brand) {
        const index = Math.floor(Math.random() * brand.length);
        return Array.from(brand).map((char, i) =>
            i === index && this.chars.cyrillic[char] ? this.chars.cyrillic[char] : char
        ).join('');
    }


    obfuscateString(brand, isEnglish = false) {
        if (isEnglish) {
            return this.replaceWithCyrillic(brand);
        } else {
            return this.insertRandomChar(brand);
        }
    }


    insertRandomChar(brand) {
        const insertStr = this.allChars[Math.floor(Math.random() * this.allChars.length)];
        let strList = Array.from(brand);
        if (strList.length > 1) {
            const randomIndex = Math.floor(Math.random() * (strList.length - 1)) + 1;
            strList.splice(randomIndex, 0, insertStr);
        }
        return strList.join('');
    }


    change(inputStr) {
        const brands = ["梦子沫", "北思沫", "MYDCT", "VBFG", "PESGE"];
        let outputStr = inputStr;
        for (let brand of brands) {
            const regex = new RegExp(brand, 'gi');
            if (regex.test(outputStr)) {
                outputStr = outputStr.replace(regex, (match) =>
                    this.obfuscateString(match, /^[A-Z]+$/.test(brand))
                );
            }
        }
        return outputStr;
    }
}

function changeBrandFile(element) {
    handleFileUpload(element, 'changeBrandFile', json => {
        if (!validateExcelFormat(json, 500, ["序号", "链接", "内容"])) {
            return false;
        }
        if (json.length === 1) {
            alert("请至少选择一条数据");
            return false;
        }
        if (json.length > 1 && json[0][2] === "") {
            alert("请选择要替换的文字");
            return false;
        }
        const api = OwnFlaskApi.changeBrandFile;
        var data = {
            "data": json,
            "your_data_field": api,
        };


        JsonRequest(api, data)
            .then(function (result) {
                alert(result.message)
                outExlsx(result.data, '评论内容导出');
            })
            .catch(function (error) {
                alert(error)
            })


        return true;
    });
}


function changeBrand() {
    const $input = $('input[name="change_brand_input"]')
    const str = $input.val().toUpperCase();

    if (str.length > 0) {
        // 获取api
        const api = OwnFlaskApi.changeBrand;
        const data = {
            "brand": str,
            "your_data_field": api,
        };
        // 获取a1
        // 将cookie信息发送到服务器
        JsonRequest(api, data)
            .then(function (result) {
                if (result.status === "success") {
                    alert(result.message)
                    $input.val(result.data);
                } else {
                    alert(result.message);
                }
            })
            .catch(function (error) {
                alert(error);
            });

    } else {
        alert("请输入要混淆的内容");
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


function outputPvcontent(element) {
    const data = $(element).data('save').contents;
    outExlsx(data, '图文内容导出');
}

function InputComPvcontent() {
    const data = [['时间', '链接', '评论内容']];
    outExlsx(data, '导入模板');
}

function InputChangeBrand() {
    const data = [['序号', '链接', '内容']];
    outExlsx(data, '导入模板');
}

function outputPvcontentSelected(element) {
    const $element = $(element);
    const tab = $($element.closest('a').attr('href')).find("tbody");
    const $checkboxes = tab.find('input[type="checkbox"]:checked');

    if ($checkboxes.length === 0) {
        alert("请选择要导出的记录");
        return;
    }

    const data = [["链接", "标题", "备注信息", "商品", "用户", "导入日期", "笔记状态"]];
    $checkboxes.each(function () {
        const data_save = $(this).attr("data-save").split(",");
        data.push(data_save);
    });

    outExlsx(data, '图文内容导出');
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

function uploadHasCommentFile(element) {
    handleFileUpload(element, "promotionComFile", json => {
        if (!validateExcelFormat(json, 200, ["时间", "链接", "评论内容"])) {
            return false;
        }

        const formData = new FormData();
        formData.append('file', JSON.stringify(json));
        const url = "/promotionCom/FileHasComment";

        FileRequest({formArray: formData, url: url})
            .then(result => alert(result.message))
            .catch(error => alert(error))
            .finally(() => resetButton(button));

        return true;
    });
}
