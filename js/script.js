//todo - Lỗi khi chọn checkbox sẽ không get các input text value để css cho box
//todo - item css nên có input chọn đúng từng item - apply css cho tất cả item cùng lúc không được
//todo - render nội dung mô tả css
// Dark mode
const body = document.querySelector('body');
const modeButton = document.querySelector('.mode-button');
const buttonChange = modeButton.querySelector('.button-change');

modeButton.onclick = () => {
    if (modeButton.classList.contains('day-on')) {
        modeButton.classList.remove('day-on');
        modeButton.classList.add('night-on');
        buttonChange.style.transform = 'translateX(170%)';

        body.classList.remove('mode-day');
        body.classList.add('mode-night');
    } else {
        modeButton.classList.remove('night-on');
        modeButton.classList.add('day-on');
        buttonChange.style.transform = 'translateX(0)';

        body.classList.remove('mode-night');
        body.classList.add('mode-day');
    }

}

// Drop attribute
function handleDropAttribute() {
    const dropBox = document.querySelectorAll('.box-drop');
    const dropBoxArr = [...dropBox];

    dropBoxArr.forEach((box, index, currentArr) => {
        box.querySelector('.box-name').onclick = () => {
            box.classList.contains('drop') ? box.classList.remove('drop') : box.classList.add('drop');
        }
    });
}

handleDropAttribute();

// Drag resize container
const dragButton = document.querySelector('.control-box');
const mainBox = document.querySelector('.main-box');

let findDistance = (smallBox, largeBox) => {
    let smallRect = smallBox.getBoundingClientRect();
    let largeRect = largeBox.getBoundingClientRect();

    return smallRect.left - largeRect.right;
};

dragButton.addEventListener('mousedown', mouseDown);

function mouseDown(e) {
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    let prevX = e.clientX;

    function mouseMove(e) {
        let afterMoveX = e.clientX;
        let newX = afterMoveX - prevX;

        // newX < 0 => move left
        // newX > 0 => move right
        dragButton.style.right = - Math.round(newX) + 'px';
        mainBox.style.width = Math.round(mainBox.offsetWidth + findDistance(dragButton, mainBox) / 16) + 'px';

        console.log(Math.round(findDistance(dragButton, mainBox)), `=> width: ${mainBox.style.width}`)

        dragButton.style.right = 0;

        // Resize container of mainBox
        mainBox.parentElement.style.width = mainBox.style.width;
    }

    function mouseUp(e) {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
    }
}


// ==================== All Logic ====================
let flexApi = 'http://localhost:3000/flexbox';
let gridApi = ' http://localhost:3000/grid';
let userOption = window.localStorage;

start = () => {
    showOption();
    handleMainBox();
    waitingRenderAttribute(
        showDescriptionAttribute,
        denyMultipleCheckedAndHandleClick,
        handleEventInputValueAttribute
    );
}

start();

// Check option - flex or grid
function showOption() {
    // handle user option
    if (!userOption.getItem('option')) {
        userOption.setItem('option', 'flex');
    }

    let option = document.querySelectorAll('.nav-item:not(:last-child)');

    [...option].forEach((current, index) => {
        current.onclick = function (e) {
            e.preventDefault();
            userOption.setItem('option', this.dataset.option);
            getChildCustomField('custom-contain').value = this.dataset.option;

            start();
        }
    });
}

// Reset Attribute before change option flex or gird
function resetAttributeHtml(containBox, itemBox) {
    containBox.innerHTML = '<h3 class="box-title">Container CSS</h3>';
    itemBox.innerHTML = '<h3 class="box-title">Items CSS</h3>';
}

// Fetch API - flex & grid
async function getFlexData(callback) {
    try {
        await fetch(flexApi)
            .then(response => response.json())
            .then(callback)
            .catch(error => console.log('error 1: ', error))
    }
    catch (error) {
        console.log('error 2: ', error)
    }
};

async function getGridData(callback) {
    try {
        await fetch(gridApi)
            .then(response => response.json())
            .then(callback)
            .catch(error => console.log('error 1: ', error))
    }
    catch (error) {
        console.log('error 2: ', error)
    }
};

// Render full input element after fetch
function renderFlexProperty(data) {
    console.log('Flex: ', data);

    let containBox = document.querySelector('.contain-box');
    let itemBox = document.querySelector('.item-box');

    resetAttributeHtml(containBox, itemBox);

    let { container, item } = data;

    for (let key in container) {
        let openCode = `<div class="box-drop drop"><p class="box-name" data-des = "${container[key].description}"><i class='bx bx-chevron-right'></i><i class='bx bx-chevron-down'></i>${key}</p>`;
        let elementCode;

        if (container[key].value.length === 0) {
            elementCode = `<div class="attribute-item" data-des="${container[key].description}"><label for="${key}">${key}</label><input type="text" name="" id="${key}"></div>`;
        } else {
            elementCode = container[key].value.map((current, index) => {
                return `<div class="attribute-item" data-des="${current.description}"><input type="checkbox" name="" id="${key + current.name}"><label for="${key + current.name}">${current.name}</label></div>`
            }).join('');
        }

        containBox.innerHTML += openCode + elementCode + '</div>';
    }

    for (let key in item) {
        let openCode = `<div class="box-drop drop"><p class="box-name" data-des = "${item[key].description}"><i class='bx bx-chevron-right'></i><i class='bx bx-chevron-down'></i>${key}</p>`;
        let elementCode;

        if (item[key].value.length === 0) {
            elementCode = `<div class="attribute-item" data-des="${item[key].description}"><label for="${key}">${key}</label><input type="text" name="" id="${key}"></div>`;
        } else {
            elementCode = item[key].value.map((current, index) => {
                return `<div class="attribute-item" data-des="${current.description}"><input type="checkbox" name="" id="${key + current.name}"><label for="${key + current.name}">${current.name}</label></div>`
            }).join('');
        }

        itemBox.innerHTML += openCode + elementCode + '</div>';
    }

    handleDropAttribute();
}

function renderGridProperty(data) {
    console.log('Grid: ', data);

    let containBox = document.querySelector('.contain-box');
    let itemBox = document.querySelector('.item-box')

    resetAttributeHtml(containBox, itemBox);

    let { container, item } = data;

    for (let key in container) {
        let openCode = `<div class="box-drop drop"><p class="box-name" data-des = "${container[key].description}"><i class='bx bx-chevron-right'></i><i class='bx bx-chevron-down'></i>${key}</p>`;
        let elementCode;

        if (container[key].value.length === 0) {
            elementCode = `<div class="attribute-item" data-des="${container[key].value.description}"><label for="${key}">${key}</label><input type="text" name="" id="${key}"></div>`;
        } else {
            elementCode = container[key].value.map((current, index) => {
                if (current.name === '') {
                    return `<div class="attribute-item" data-des="${current.description}"><label for="${key}">${key}</label><input type="text" name="" id="${key}"></div>`;
                } else {
                    return `<div class="attribute-item" data-des="${current.description}"><input type="checkbox" name="" id="grid-${key + current.name}"><label for="grid-${key + current.name}">${current.name}</label></div>`
                }
            }).join('');
        }

        containBox.innerHTML += openCode + elementCode + '</div>';
    }

    for (let key in item) {
        let openCode = `<div class="box-drop drop"><p class="box-name" data-des = "${item[key].description}"><i class='bx bx-chevron-right'></i><i class='bx bx-chevron-down'></i>${key}</p>`;
        let elementCode;

        if (item[key].value.length === 0) {
            elementCode = `<div class="attribute-item" data-des="${item[key].value.description}"><label for="${key}">${key}</label><input type="text" name="" id="${key}"></div>`;
        } else {
            elementCode = item[key].value.map((current, index) => {
                if (current.name === '') {
                    return `<div class="attribute-item" data-des="${current.description}"><label for="${key}">${key}</label><input type="text" name="" id="${key}"></div>`;
                } else {
                    return `<div class="attribute-item" data-des="${current.description}"><input type="checkbox" name="" id="grid-${key + current.name}"><label for="grid-${key + current.name}">${current.name}</label></div>`
                }
            }).join('');
        }

        itemBox.innerHTML += openCode + elementCode + '</div>';
    }

    handleDropAttribute();
}

// Wait for rendering
async function waitingRenderAttribute(...callback) {
    getChildCustomField('custom-contain').value = userOption.getItem('option');

    if (userOption.getItem('option') === 'flex') {
        await getFlexData(renderFlexProperty);
    } else {
        await getGridData(renderGridProperty);
    }

    callback.forEach(current => current());
}

// Show description of Attribute when hover or click
function showDescriptionAttribute() {
    let attributeValue = document.querySelectorAll('.attribute-item');
    let attDesName = document.querySelector('.att-name');
    let attDesContent = document.querySelector('.att-des');
    let valDesName = document.querySelector('.value-name');
    let valDesContent = document.querySelector('.value-des');


    [...attributeValue].forEach((current, index) => {
        current.onclick = () => {
            valDesName.innerHTML = current.textContent + ':';
            attDesName.innerHTML = current.parentElement.querySelector('.box-name').textContent + ':';

            attDesContent.innerHTML = current.parentElement.querySelector('.box-name').dataset.des;
            valDesContent.innerHTML = current.dataset.des;
        }
    })
}

// Handle customization container & Item
function getChildCustomField(childClass) {
    return document.querySelector('.customization').querySelector(`.${childClass}`).querySelector('input');
}

function handleMainBox() {
    let boxField = getChildCustomField('custom-contain');
    let itemField = getChildCustomField('custom-child');
    let marginField = getChildCustomField('custom-space');
    let borderField = getChildCustomField('custom-border');

    mainBox.style.display = boxField.value;

    itemField.oninput = () => {
        mainBox.innerHTML = '';
        let step = parseInt(itemField.value);

        for (let i = 0; i < step; i++) {
            let miniItem = document.createElement('div');
            mainBox.appendChild(miniItem);
        }
    }

    marginField.oninput = () => {
        mainBox.style.padding = marginField.value + 'rem';
    }

    borderField.oninput = () => {
        [...mainBox.querySelectorAll('div')].forEach(current => {
            current.style.border = `${borderField.value}px solid var(--border-color)`;
        })
    }
}

// Only one checked in Attribute when click event
function onlyOneActiveAndHandleClick(multiple, callback) {
    // console.log(multiple);

    [...multiple].forEach(current => {

        current.onclick = () => {
            if (current.checked === false) {
                [...multiple].forEach(current => {
                    current.checked = false;
                })
            } else {
                [...multiple].forEach(current => {
                    current.checked = false;
                })

                current.checked = true;
            }

            callback()
        }

    })
}

function denyMultipleCheckedAndHandleClick() {
    let attributeParents = document.querySelectorAll('.box-drop');

    [...attributeParents].forEach(current => {
        let checkBoxField = current.querySelectorAll('.attribute-item>input[type="checkbox"]');

        if (checkBoxField.length === 0) return;

        onlyOneActiveAndHandleClick(checkBoxField, addStyleForElement);
    })
}

// Input Event for style Attribute use input type text
// Debounce input
function debounceInput(func, wait, element) {
    let timeout;

    return function executeFunc(...args) {
        if (timeout) { clearTimeout(timeout) };

        timeout = setTimeout(function () {
            func.apply(element, args);
            console.log(args)
        }, wait);
    }
}

function executeEventFunc(currentInput, cssContain, cssItem) {
    let allItem = document.querySelectorAll('.main-box>div');
    let att = currentInput.parentElement.textContent;
    let value = currentInput.value;

    if (findParentContainTrueOrItemFalse(currentInput)) {
        cssContain[att] = value;
    } else {
        cssItem[att] = value;
    }

    Object.assign(mainBox.style, cssContain);

    [...allItem].forEach(current => {
        Object.assign(current.style, cssItem);
    })
}

function handleEventInputValueAttribute() {
    let textInput = document.querySelectorAll('.attribute-box input[type="text"');

    const cssStyleContainer = {};
    const cssStyleItem = {};

    [...textInput].forEach(current => {
        const doEvent = debounceInput(executeEventFunc, 500, current);
        current.oninput = () => {
            doEvent(current, cssStyleContainer, cssStyleItem);
        }
    });
}

// Handle add complete CSS for container or item 
function findParentContainTrueOrItemFalse(attribute) {
    if (attribute.closest('div.attribute-box').classList.contains('contain-box')) {
        return true;
    } else if (attribute.closest('div.attribute-box').classList.contains('item-box')) {
        return false;
    }
}

function clearStyle(box, items) {
    box.style = {};
    [...items].forEach(current => {
        current.style = {}
    })
}

function addStyleForElement() {
    let allItem = document.querySelectorAll('.main-box>div');
    let check = document.querySelectorAll('input[type="checkbox"');

    let allCheckBox = [...check].filter(current => {
        return current.checked === true;
    })

    const cssStyleContainer = {};
    const cssStyleItem = {};

    allCheckBox.forEach(newCurrent => {
        let att = newCurrent.parentElement.parentElement.querySelector('.box-name').textContent;
        let value = newCurrent.parentElement.textContent;

        if (findParentContainTrueOrItemFalse(newCurrent)) {
            cssStyleContainer[att] = value;
        } else {
            cssStyleItem[att] = value;
        }
    });

    clearStyle(mainBox, allItem);

    Object.assign(mainBox.style, cssStyleContainer);
    [...allItem].forEach(current => {
        Object.assign(current.style, cssStyleItem);
    })
}