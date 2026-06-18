import React from 'react'
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

function Foooter() {
  return (
    <>
      <div className="bg-[#86312a] py-12 px-6 md:px-[40px] w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-4">
            <div className="flex justify-start items-start">
              <img src="https://new.parkcinema.az/images/logo.svg" width={160} height={35} alt="logo" />
            </div>
            
            <div className="text-[15px] sm:text-[16px] text-[#d9dadb] flex flex-col gap-4 items-start">
                <a href="#" className="hover:text-white transition-colors">Kinoteatrlar</a>
                <a href="#" className="hover:text-white transition-colors">Aksiyalar</a>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
            </div>
            
            <div className="text-[15px] sm:text-[16px] text-[#d9dadb] flex flex-col gap-4 items-start">
                <a href="#" className="hover:text-white transition-colors">Profil</a>
                <a href="#" className="hover:text-white transition-colors">Hüquqi Şərtlər</a>
                <a href="#" className="hover:text-white transition-colors">Əlaqə</a>
            </div>
            
            <div className="text-[15px] sm:text-[16px] text-[#d9dadb] flex flex-col gap-4 items-start">
                <p className="font-bold text-white tracking-wide">Bizi İzləyin</p>
                <div className="flex gap-4 items-center">
                    <a href="#" className="flex justify-center items-center w-9 h-9 bg-[#d9dadb] hover:bg-white transition-colors rounded-full text-[#86312a] text-[18px]" aria-label="Instagram"><RiInstagramFill /></a>
                    <a href="#" className="flex justify-center items-center w-9 h-9 bg-[#d9dadb] hover:bg-white transition-colors rounded-full text-[#86312a] text-[18px]" aria-label="Facebook"><FaFacebook /></a>
                    <a href="#" className="flex justify-center items-center w-9 h-9 bg-[#d9dadb] hover:bg-white transition-colors rounded-full text-[#86312a] text-[18px]" aria-label="Youtube"><FaYoutube /></a>
                    <a href="#" className="flex justify-center items-center w-9 h-9 bg-[#d9dadb] hover:bg-white transition-colors rounded-full text-[#86312a] text-[18px]" aria-label="Telegram"><FaTelegram /></a>
                    <a href="#" className="flex justify-center items-center w-9 h-9 bg-[#d9dadb] hover:bg-white transition-colors rounded-full text-[#86312a] text-[18px]" aria-label="Tiktok"><FaTiktok /></a>
                </div>
            </div>
            
            <div className="flex justify-start items-center">
              <img src="https://new.parkcinema.az/icons/Visa.svg" alt="Visa" className="w-[100px] h-auto" />
            </div>
        </div>
      </div>
    </>
  )
}

export default Foooter
