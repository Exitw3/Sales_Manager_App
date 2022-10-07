class Managetor {
    constructor(id, avatar, name, inventory, money) {
        this.id = id;
        this.avatar = avatar;
        this.name = name;
        this.inventory = inventory;
        this.money = money;
    }
}
const manage_key = "manage_app";
var managetors = [];
var page_size = 4;
var total_pages = 0;
var page_number = 1;

var cart = [];

function init() {
    if (window.localStorage.getItem(manage_key) == null) {
        managetors = [
            new Managetor(5, "https://cdn.tgdd.vn/Products/Images/9418/288389/locknlock-ejf357blk-1.jpg", "Nồi chiên không dầu Lock&Lock", "400", "50"),
            new Managetor(4, "https://cdn.tgdd.vn/Products/Images/2403/233060/kangaroo-kg662xl-9-org.jpg", "Chảo nhôm sâu chống dính", "350", "30"),
            new Managetor(3, "https://cdn.tgdd.vn/Products/Images/1982/289921/doi-lap-am-ava-ly-ds3s-2.jpg", "Bếp từ đôi lắp âm AVA", "200", "150"),
            new Managetor(2, "https://www.lg.com/vn/images/puricare/gallery/medium01.jpg", "Máy lọc không khí LG PuriCare", "90", "1000"),
            new Managetor(1, "https://cdn01.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Apro/Apro_product_27474/may-loc-nuoc-no_main_495_450.png.webp", "Máy loc nước MUTOSI", "40", "500")
        ]
        window.localStorage.setItem(manage_key, JSON.stringify(managetors));
    }
    else {
        managetors = JSON.parse(window.localStorage.getItem(manage_key));
    }
}

function renderManage() {
    let data = managetors.slice((page_size * (page_number - 1)), (page_size * page_number));
    let htmls = data.map(function (can) {
        return `
        <tr ondblclick="editManage(${can.id})">
            <td>
                <div class="manege-avatar">
                    <img class="avatar-sm" src="${can.avatar}" alt="">
                </div>
            </td>
            <td class="fw-bolder"><h3>${can.name}</h3></td>
            <td class="fw-bolder">${can.inventory}</td>
            <td class="fw-bolder">${(can.money) * (can.inventory)} $</td>
            <td>
                <span class="times" onclick='removeManagetor(${can.id})' >&times;</span>
            </td>
        </tr>
        `
    })
    document.getElementById('tbManage').innerHTML = htmls.join("");
    buildPagination();
    calculator();
}

function calculator() {
    let totalinventory = 0;
    let totalmoney = 0;
    for (let can of managetors) {
        totalinventory += can.inventory;
        totalmoney += can.money;
    }
    document.getElementById('suminventory').innerHTML = totalinventory;
    document.getElementById('summoney').innerHTML = totalmoney * totalinventory;
}


function saveManagetor() {
    let avatar = document.getElementById("avatar").value;
    let name = document.getElementById("name").value;
    let inventory = Number(document.getElementById("inventory").value);
    let money = Number(document.getElementById("money").value);
    let id = findMaxId() + 1;

    if (avatar == null || avatar == '') {
        alert('Hãy dán link ảnh sản phẩm.');
        return;
    } if (money == null || money == '') {
        alert('Hãy nhập giá của sản phẩm');
        return;
    } if (money <= 0 || money >= 999999) {
        alert('giá không được âm')
        return;
    } if (inventory == null || inventory == '') {
        alert('nhập số Lượng');
        return;
    }
     if (name == null || name == '') {
        alert('Nhập Tên Sản Phẩm');
        return;
    }

    let managetor = new Managetor(id, avatar, name, inventory, money);
    managetors.unshift(managetor);

    window.localStorage.setItem(manage_key, JSON.stringify(managetors));

    renderManage();

    resetForm()
}

function resetForm() {
    document.getElementById("manageId").value = "0";
    document.getElementById("avatar").value = "";
    document.getElementById("name").value = "";
    document.getElementById("inventory").value = "";
    document.getElementById("money").value = "";

    document.getElementById('btnCreate').classList.remove('d-none');
    document.getElementById('btnUpdate').classList.add('d-none');
}

function findMaxId() {
    let max = 0;
    for (let can of managetors) {
        if (can.id > max) {
            max = can.id
        }
    }
    return max;
}

function removeManagetor(managetorId) {
    let confirm = window.confirm("Are you sure to remove this managetor?");
    if (confirm) {
        let index = managetors.findIndex(function (can) {
            return can.id == managetorId;
        })
        managetors.splice(index, 1);

        window.localStorage.setItem(manage_key, JSON.stringify(managetors));

        renderManage();
    }
}

function editManage(managetorId) {
    let managetor = managetors.find(function (can) {
        return can.id == managetorId;
    })

    document.getElementById("manageId").value = managetor.id;
    document.getElementById("avatar").value = managetor.avatar;
    document.getElementById("name").value = managetor.name;
    document.getElementById("inventory").value = managetor.inventory;
    document.getElementById("money").value = managetor.money;


    document.getElementById('btnCreate').classList.add('d-none');
    document.getElementById('btnUpdate').classList.remove('d-none');
}

function updateManagetor() {
    let avatar = document.getElementById("avatar").value;
    let name = document.getElementById("name").value;
    let inventory = Number(document.getElementById("inventory").value);
    let money = Number(document.getElementById("money").value);
    let id = document.getElementById("manageId").value;

    let currentManagetor = managetors.find(function (can) {
        return can.id == id;
    })

    currentManagetor.avatar = avatar;
    currentManagetor.name = name;
    currentManagetor.inventory = inventory;
    currentManagetor.money = money;

    window.localStorage.setItem(manage_key, JSON.stringify(managetors));

    renderManage();
    resetForm();
}

function ascending(field) {
    managetors.sort(function (can_1, can_2) {
        return can_1[field] - can_2[field];
    })
    renderManage();
}
function descending(field) {
    managetors.sort(function (can_1, can_2) {
        return can_2[field] - can_1[field];
    })
    renderManage();
}


function buildPagination() {
    total_pages = Math.ceil(managetors.length / page_size);
    let paginationString = "";
    let start = page_number == 1 ? 1 : page_number == total_pages ? page_number - 2 : page_number - 1;
    let end = page_number == total_pages ? total_pages : page_number == 1 ? page_number + 2 : page_number + 1;
    paginationString += `<li class="page-item"><button onclick='changePage(1)'>&#x25C0;</button></li>`;
    for (let page = 1; page <= total_pages; page++) {
        paginationString += `<li class="page-item">
                                    <button class='${page == page_number ? 'active' : ''}'
                                        onclick='changePage(${page})'>
                                ${page}</button></li>`
    }
    paginationString += `<li class="page-item"><button onclick='changePage(${total_pages})'>&#x25B6;</button></li>`;
    document.getElementById('pagination').innerHTML = paginationString;
}


function changePage(page) {
    page_number = page;
    renderManage();
}
function ready() {
    init();
    renderManage();
}

ready();