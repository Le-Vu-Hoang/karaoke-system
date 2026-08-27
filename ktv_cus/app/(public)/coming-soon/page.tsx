import { UnderConstruction } from "@/presentation/shared_ui/under-construction";

export default function ComingSoonPage() {
  return (
    <div className="container mx-auto py-12 md:py-24">
      <UnderConstruction 
        title="Tính năng đang được phát triển"
        description="Xin lỗi, trang bạn đang tìm kiếm hiện chưa hoàn thiện. Đội ngũ của chúng tôi đang nỗ lực cập nhật nội dung sớm nhất. Xin cảm ơn!"
        showBackButton={true}
      />
    </div>
  );
}
