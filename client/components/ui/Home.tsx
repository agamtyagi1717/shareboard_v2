import Link from "next/link";
import React from "react";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col mt-[35vh] justify-center items-center">
      <h1 className="sm:text-3xl text-xl sm:w-[810px] text-center mx-10">
        Effortlessly Share Files 🌐, Establish Direct Connections 🤝, and Engage
        in Instant Messaging 💬 with ShareBoard!
      </h1>
      <Link href={"/share"}>
        <Button className="mt-3" variant="outline">
          Get Started <ArrowRight className="ml-1" size={18} />
        </Button>
      </Link>
    </div>
  );
};

export default Home;
