import React, { useState } from 'react'


function Dropdown({ textColor }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectLang, setSelectedLang] = useState('AZE')

  const languages = [
    { code: 'AZE', flag: 'https://new.parkcinema.az/icons/az-flag.svg' },
    { code: 'EN', flag: 'https://new.parkcinema.az/icons/en-flag.svg' },
    { code: 'RU', flag: 'https://new.parkcinema.az/icons/ru-flag.svg' },
  ]

  const handleSelect = (code) => {
    setSelectedLang(code)
    setIsOpen(false)
  }

  const selected = languages.find(l => l.code === selectLang)

  return (
    <div className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-transparent px-3 py-2 rounded cursor-pointer ${textColor || 'text-white'}`}
      >
        <img src={selected?.flag} alt={selectLang} className="w-5 h-5" />
        <span className="text-sm">{selectLang}</span>
        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.5 7l4.5 4.5L14.5 7z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-[90px] h-[121px] bg-[#DBD9D9] text-black text-[16px] rounded shadow-md">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="flex items-center gap-2 px-3 py-2 w-[82px]  cursor-pointer hover:bg-gray-300"
            >
              <img src={lang.flag} alt={lang.code} className="w-5 h-5" />
              <span className="text-sm">{lang.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
