from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# دالة مساعدة لفتح الاتصال بقاعدة البيانات بشكل آمن
def get_db_connection():
    conn = sqlite3.connect("shop.db")
    conn.row_factory = sqlite3.Row  # تتيح لنا قراءة البيانات بقاموس (Key-Value)
    return conn

# 1. عرض الصفحة الرئيسية
@app.route("/")
def index():
    return render_template("index.html")

# 2. جلب قائمة المنتجات (API لوالدتك لترى المخزون)
@app.route("/api/products", methods=["GET"])
def get_products():
    conn = get_db_connection()
    products = conn.execute("SELECT * FROM products").fetchall()
    conn.close()
    
    # تحويل البيانات إلى صيغة قائمة بايثون لإرسالها للواجهة
    return jsonify([dict(p) for p in products])

# 3. إضافة منتج جديد بأمان (حماية من ثغرات الحقن)
@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.json
    name = data["name"]
    size = data["size"]
    price = data["price"]
    stock = data["stock"]

    conn = get_db_connection()
    # استخدام علامة ? كجدار حماية ضد ثغرة الـ SQL Injection
    conn.execute("""
        INSERT INTO products (name, category, size, color, price, stock)
        VALUES (?, 'عام', ?, 'افتراضي', ?, ?)
    """, (name, size, price, stock))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "تم حفظ المنتج في قاعدة البيانات الحصينة!"})

# 4. تسجيل عملية بيع وتحديث الجرد
@app.route("/api/sales", methods=["POST"])
def make_sale():
    data = request.json
    p_id = data["productId"]
    qty = data["qty"]

    conn = get_db_connection()
    
    # التأكد أولاً من وجود مخزون كافٍ (حماية البيانات من التضارب)
    product = conn.execute("SELECT * FROM products WHERE id = ?", (p_id,)).fetchone()
    if not product or product["stock"] < qty:
        conn.close()
        return jsonify({"status": "error", "message": "المخزون غير كافٍ!"}), 400

    # حساب الإجمالي وخصم الكمية
    total_price = product["price"] * qty
    conn.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (qty, p_id))
    
    # تسجيل الفاتورة في جدول المبيعات
    conn.execute("""
        INSERT INTO sales (product_id, quantity, total_price)
        VALUES (?, ?, ?)
    """, (p_id, qty, total_price))
    
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "total": total_price})

if __name__ == "__main__":
    app.run(debug=True)
