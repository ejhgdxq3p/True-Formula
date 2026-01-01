export default function RotatingPointer() {
  return (
    <span className="cursor-3d-pointer inline-block">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {/* 黄色部分（箭头左半） */}
        <polygon
          points="4,12 12,4 12,20"
          fill="#FDE700"
          stroke="#0F380F"
          strokeWidth="1.5"
        />
        {/* 绿色部分（箭头右半） */}
        <polygon
          points="12,4 20,12 12,20"
          fill="#009640"
          stroke="#0F380F"
          strokeWidth="1.5"
        />
        {/* 中间分割线 */}
        <line
          x1="12"
          y1="4"
          x2="12"
          y2="20"
          stroke="#0F380F"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}
