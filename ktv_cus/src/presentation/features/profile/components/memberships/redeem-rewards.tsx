"use client";

import { Gift, Award, Percent, Beer, Utensils, Ticket, Clock, Wine } from "lucide-react";

import { toast } from "@/presentation/shared_ui/sonner";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  image?: string;
}

export default function RedeemRewards() {
  const rewards: RewardItem[] = [
    {
      id: "room-50",
      title: "50% Off Room Rate",
      description: "Valid for any suite booking on weekdays.",
      points: 5000,
      icon: <Percent className="size-8 text-secondary" />,
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400",
    },
    {
      id: "beer-tower",
      title: "Free Beer Tower",
      description: "Choose from our selection of premium drafts.",
      points: 3500,
      icon: <Beer className="size-8 text-tertiary" />,
      image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?q=80&w=400",
    },
    {
      id: "fruit-platter",
      title: "VIP Fruit Platter",
      description: "Seasonal premium fruits carved to perfection.",
      points: 2000,
      icon: <Utensils className="size-8 text-primary" />,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
    },
    {
      id: "cocktail",
      title: "Signature Cocktail",
      description: "Craft cocktail crafted by our house mixologist.",
      points: 500,
      icon: <Wine className="size-8 text-secondary" />,
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400",
    },
    {
      id: "voucher-10",
      title: "$10 Cash Voucher",
      description: "Direct cash discount on any food & beverage bill.",
      points: 1200,
      icon: <Ticket className="size-8 text-primary" />,
    },
    {
      id: "party-platter",
      title: "Party Food Platter",
      description: "A combination of gourmet finger foods for groups.",
      points: 850,
      icon: <Utensils className="size-8 text-secondary" />,
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=400",
    },
    {
      id: "extra-hour",
      title: "Extra Hour Free",
      description: "Get 1 extra hour free when booking 2+ hours.",
      points: 2500,
      icon: <Clock className="size-8 text-tertiary" />,
    },
  ];

  const handleRedeem = (id: string, points: number) => {
    toast.info(`Đang đổi phần thưởng ${id} với ${points} L-Points. Tính năng này đang được phát triển.`);
  };

  return (
    <section className="mb-16 md:mb-20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-heading text-lg md:text-headline-md text-white flex items-center gap-3 font-bold">
          <Gift className="size-6 text-secondary" /> Redeem Rewards
        </h3>
        <button
          type="button"
          className="text-primary text-xs md:text-sm font-semibold hover:underline cursor-pointer"
        >
          View History
        </button>
      </div>

      {/* Horizontal scrolling on mobile, Grid on desktop */}
      <div className="flex overflow-x-auto gap-5 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible custom-scrollbar">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="flex-shrink-0 w-64 md:w-auto glass-card rounded-2xl p-5 flex flex-col gap-4 border border-outline-variant/10 backdrop-blur-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
          >
            {/* Visual Header */}
            <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-surface-container flex items-center justify-center border border-white/5">
              {reward.image ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                  <img
                    className="w-full h-full object-cover opacity-80"
                    alt={reward.title}
                    src={reward.image}
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  {reward.icon}
                </div>
              )}
              
              <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 z-20">
                <span className="text-[10px] font-sans font-bold text-primary flex items-center gap-1">
                  <Award className="size-3" /> {reward.points.toLocaleString()} pts
                </span>
              </div>
            </div>

            {/* Information */}
            <div className="flex-grow">
              <h4 className="font-heading text-base font-bold text-white line-clamp-1">
                {reward.title}
              </h4>
              <p className="text-on-surface-variant text-xs mt-1 leading-relaxed line-clamp-2">
                {reward.description}
              </p>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-outline-variant/10">
              <div className="flex items-center gap-1 text-primary text-xs font-bold">
                <span>{reward.points.toLocaleString()} L-PTS</span>
              </div>
              <button
                type="button"
                onClick={() => handleRedeem(reward.id, reward.points)}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                Redeem
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
