"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const data: any = {
  "3": {
    id: 3,
    name: "Coinbase",
    img: "/assets/icons/image 1682-10.png",
  },
  "6": {
    id: 6,
    name: "Coinbase",
    img: "/assets/icons/image 1682-2.png",
  },
  "10": {
    id: 10,
    name: "Coinbase",
    img: "/assets/icons/image 1682-1.png",
  },
  "12": {
    id: 12,
    name: "Coinbase",
    img: "/assets/icons/image 1682-3.png",
  },
  "14": {
    id: 14,
    name: "Coinbase",
    img: "/assets/icons/image 1682-4.png",
  },
  "32": {
    id: 32,
    name: "Coinbase",
    img: "/assets/icons/image 1682-5.png",
  },
  "36": {
    id: 36,
    name: "Coinbase",
    img: "/assets/icons/image 1682-6.png",
  },
  "40": {
    id: 40,
    name: "Coinbase",
    img: "/assets/icons/image 1682-7.png",
  },
  "42": {
    id: 42,
    name: "Coinbase",
    img: "/assets/icons/image 1682-8.png",
  },
  "44": {
    id: 44,
    name: "Coinbase",
    img: "/assets/icons/image 1682-9.png",
  },
};

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function HomeExchanges() {
  return (
    <div
      className="w-full flex flex-col items-center justify-center relative "
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-[25px] max-lg:grid-cols-6 max-md:grid-cols-3 w-full">
        {Array(53)
          .fill(1)
          .map((item, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg p-2 custom-exchange-box flex items-center justify-center min-h-[85px] col-span-1 row-span-1 group",
                data[index] && "active col-span-2 row-span-2 relative"
              )}
            >
              {/* Border Top xuất hiện khi hover */}
              {data[index]?.img && (
                <div className="absolute top-0 right-0 w-full h-full hidden group-hover:block">
                  <img
                    src="/assets/images/border-bot-top.png"
                    alt="border"
                    className="w-full h-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-center p-2 flex-1 bg-[#101010] h-full rounded-lg">
                {data[index] ? (
                  <Image
                    src={data[index]?.img}
                    alt="coinbase"
                    width={100}
                    height={100}
                    className={cn(
                      "rounded-full",
                      entry?.isIntersecting &&
                        "animate-fade animate-duration-[1500ms]"
                    )}
                    style={{
                      animationDelay: `${getRandomNumber(300, 500)}ms`,
                    }}
                  />
                ) : null}
              </div>
            </div>
          ))}
      </div>

      <div
        className={cn(
          "custom-exchange-content-bg w-full flex flex-col gap-2 items-center justify-center p-14 max-lg:p-8 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-10"
        )}
      >
        <img
          src="/assets/images/bg-exchange.png"
          alt=""
          className="absolute w-full h-full"
        />
        <p
          className={cn(
            "description",
            entry?.isIntersecting && "animate-fade-up animate-duration-[1500ms]"
          )}
        >
          Top best exchanges floors on the planet
        </p>
        <h2
          className={cn(
            "heading-1 text-center flex items-center gap-2 max-lg:inline",
            entry?.isIntersecting && "animate-fade-up animate-duration-[1500ms]"
          )}
        >
          List on the world’s TOP 10<p className="decor">Exchanges</p>
        </h2>
      </div>
    </div>
  );
}

export default HomeExchanges;
