import React from "react";
import Card_1 from "./Card_1";
import { cards } from "./Card_1_Data";

const Card_1_Section = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card_1
          key={index}
          title={card.title}
          description={card.description}
          icon={card.icon}
        />
      ))}
    </section>
  );
};

export default Card_1_Section;
