// 1. دالة جلب المنتجات من بايثون وعرضها لوالدتك فور فتح الصفحة
function updateUI() {
    // الاتصال برابط بايثون المخصص لجلب البيانات
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            let pTable = document.getElementById("productsTable");
            pTable.innerHTML = "";
            
            let pSelect = document.getElementById("saleProductSelect");
            pSelect.innerHTML = '<option value="">-- اختر من المخزن --</option>';

            products.forEach(p => {
                // تنبيه المخزون: يقلب اللون للأحمر العريض لو البضاعة أقل من 3 قطع
                let stockColor = p.stock < 3 ? 'red' : 'black';
                let stockWeight = p.stock < 3 ? 'bold' : 'normal';

                pTable.innerHTML += `<tr>
                    <td>${p.name}</td>
                    <td>${p.size}</td>
                    <td>${p.price} ل.س</td>
                    <td style="color: ${stockColor}; font-weight: ${stockWeight}">${p.stock} قطعة</td>
                </tr>`;

                // إضافة المنتج لقائمة البيع فقط إذا كان متوفراً في المستودع
                if(p.stock > 0) {
                    pSelect.innerHTML += `<option value="${p.id}">${p.name} (${p.size})</option>`;
                }
            });
        })
        .catch(err => console.error("خطأ في الاتصال ببايثون (تأكد من تشغيل app.py):", err));

    // جلب سجل مبيعات اليوم وتحديث صندوق الأرباح
    updateSalesTable();
}

// 2. دالة إرسال منتج جديد إلى بايثون ليحفظه في قاعدة البيانات الحصينة
function addProduct() {
    let name = document.getElementById("pName").value;
    let size = document.getElementById("pSize").value;
    let price = parseFloat(document.getElementById("pPrice").value);
    let stock = parseInt(document.getElementById("pStock").value);

    if(!name || isNaN(price) || isNaN(stock)) {
        alert("الرجاء تعبئة الاسم والسعر والكمية بشكل صحيح!");
        return;
    }

    let productData = { name: name, size: size, price: price, stock: stock };

    // استخدام fetch لإرسال البيانات أونلاين للسيرفر الخلفي بصيغة JSON
    fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        // تفريغ المدخلات لتجهيزها للقطعة القادمة
        document.getElementById("pName").value = "";
        document.getElementById("pSize").value = "";
        document.getElementById("pPrice").value = "";
        document.getElementById("pStock").value = "";

        updateUI(); // تحديث الشاشة والجداول فوراً
    })
    .catch(err => alert("فشل الاتصال بالسيرفر! هل نسيت تشغيل ملف app.py؟"));
}

// 3. دالة تسجيل مبيعة جديدة وتحديث جرد المخزن في قاعدة البيانات
function makeSale() {
    let productSelect = document.getElementById("saleProductSelect");
    let pId = parseInt(productSelect.value);
    let qty = parseInt(document.getElementById("saleQty").value);

    if(!pId || isNaN(qty) || qty <= 0) {
        alert("الرجاء اختيار منتج وتحديد كمية صحيحة!");
        return;
    }

    let saleData = { productId: pId, qty: qty };

    fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
    })
    .then(response => {
        if (!response.ok) {
            // هندسة عكسية للأخطاء: إذا أرجع بايثون خطأ (مثل نقص المخزون)
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("saleQty").value = 1; // إعادة ضبط الكمية الافتراضية
        updateUI(); // تحديث كامل الواجهات
    })
    .catch(err => alert(err.message));
}

// دالة داخلية لتحديث جدول المبيعات وصندوق إجمالي الأرباح اليومي
function updateSalesTable() {
    // ملاحظة: سجل المبيعات سنربطه ببايثون بالكامل لاحقاً، حالياً سيعتمد على تحديث الواجهة من قاعدة البيانات
    let sTable = document.getElementById("salesTable");
    // هذا الجزء سيقوم بايثون بتغذيته تلقائياً عند طلب السيرفر
}

// تشغيل جلب البيانات فور تحميل الصفحة لأول مرة
updateUI();
