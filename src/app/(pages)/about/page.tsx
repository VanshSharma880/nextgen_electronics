import IconCloudDemo from "@/components/IconCloudDemo";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <IconCloudDemo />
        <div className="max-w-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200 sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis
            eros at lacus feugiat hendrerit sed ut tortor. Suspendisse et magna
            quis elit efficitur consequat. Mauris eleifend velit a pretium
            iaculis. Donec sagittis velit et magna euismod, vel aliquet nulla
            malesuada. Nunc pharetra massa lectus, a fermentum arcu volutpat
            vel.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Learn more about us
              <span className="ml-2">&#8594;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
