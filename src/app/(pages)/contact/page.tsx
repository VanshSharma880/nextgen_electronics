import { Button } from "@/components/ui/button";
import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaRegPaperPlane,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className=" text-gray-900 dark:text-white min-h-screen py-12 transition-all duration-300">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <section className="mb-32">
        <div
          id="map"
          className="relative border-black border-[1px] h-[300px] overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11672.945750644447!2d-122.42107853750231!3d37.7730507907087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858070cc2fbd55%3A0xa71491d736f62d5c!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1619524992238!5m2!1sen!2sus')",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11672.945750644447!2d-122.42107853750231!3d37.7730507907087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858070cc2fbd55%3A0xa71491d736f62d5c!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1619524992238!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>

        <div className="container px-4 md:px-12 mt-[-100px]">
          <div className="bg-gray-900 rounded-lg shadow-md p-8 md:p-12 backdrop-blur-lg border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Form */}
              <div className="w-full lg:w-6/12">
                <form className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      className="peer block w-full bg-transparent border-2 border-gray-500 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Name"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      className="peer block w-full bg-transparent border-2 border-gray-500 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Email"
                    />
                  </div>
                  <div className="relative">
                    <textarea
                      className="peer block w-full bg-transparent border-2 border-gray-500 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={4}
                      placeholder="Message"
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-sky-500 border-gray-500 rounded-md"
                      id="copyMessage"
                    />
                    <label
                      className="text-sm text-neutral-300"
                      htmlFor="copyMessage"
                    >
                      Send me a copy of this message
                    </label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full  bg-white text-black py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <FaRegPaperPlane />
                    Send
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="w-full lg:w-6/12">
                <div className="flex flex-col space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-white p-3 rounded-md bg-gray-700">
                      <FaEnvelope className="text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Email</p>
                      <p className="text-sm text-gray-300">example@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-white p-3 rounded-md bg-gray-700">
                      <FaPhone className="text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Phone</p>
                      <p className="text-sm text-gray-300">1-600-890-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-white p-3 rounded-md bg-gray-700">
                      <FaMapMarkerAlt className="text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Address</p>
                      <p className="text-sm text-gray-300">
                        Lorem ipsum dolor sit amt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
