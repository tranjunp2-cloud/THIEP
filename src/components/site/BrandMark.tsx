/**
 * Logo chữ "SayIDo": "Say" và "Do" viết tay, chữ "I" là serif nghiêng màu vàng —
 * để không bị đọc nhầm thành "J" như khi viết cả từ bằng chữ thảo.
 */
export function BrandMark() {
  return (
    <>
      Say<em className="brand-i">I</em>Do
    </>
  );
}

export const BRAND = "SayIDo";
