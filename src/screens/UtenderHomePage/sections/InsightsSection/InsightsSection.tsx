import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const InsightsSection = (): JSX.Element => {
 const navigate = useNavigate();
 const bulletPoints = [
  {
   icon: "/group-1321316870.png",
   text: (
    <>
     <span className="font-semibold text-[#f0c419]">uTender.eu</span>
     <span className=" text-[#1b2631]"> informon kompani dhe individë për tenderët në Kosovë.</span>
    </>
   ),
  },
  {
   icon: "/group-1321316870-1.png",
   text: (
    <>
     <span className="text-[#1b2631]">Publikojmë të gjithë </span>
     <span className="[font-family:'Gilroy-SemiBold-SemiBold',Helvetica] font-semibold text-[#f0c419]">tenderët aktivë</span>
     <span className="text-[#1b2631]"> në kohë reale, çdo ditë.</span>
    </>
   ),
  },
  {
   icon: "/group-1321316870-2.png",
   text: (
    <>
     <span className="text-[#1b2631]">Pas konfirmimit, përfitoni shërbimin tonë. Abonohu tani dhe fito një javë </span>
     <span className="[font-family:'Gilroy-SemiBold-SemiBold',Helvetica] font-semibold text-[#f0c419]">FALAS!</span>
    </>
   ),
  },
 ];

 return (
  <section className="w-full py-8 md:py-12 lg:py-16">
   <div className="container mx-auto px-8">
    <div className="flex flex-col  lg:flex-row gap-6 lg:gap-[30px]">
     {/* First Card */}
     <Card className="w-full  bg-[#f6f9ff] rounded-xl border-0 shadow-none">
      <CardContent className="p-6 lg:p-0 lg:relative lg:h-[416px]">
       {/* Desktop absolute positioning */}
       <div className="hidden lg:block">
        <div className="absolute top-[22px] right-[20px] w-[221px] h-[372px] rounded-xl shadow-[0px_0px_10px_#00000014] bg-[url(/unsplash-db145egtalk.png)] bg-cover bg-[50%_50%]" />

        <div className="flex flex-col items-start gap-5 absolute top-[22px] left-[22px]">
         <img className="relative w-[37.78px] h-[37.78px]" alt="Group" src="/group-1000006883-9.png" />

         <div className="flex flex-col items-start gap-[15.31px] relative self-stretch w-full flex-[0_0_auto]">
          <h2 className="relative self-stretch mt-[-0.77px]font-bold text-[#1b2631] text-[27px] tracking-[-0.92px] leading-[36.8px]">
           Cfarë ofron Utender.eu?
          </h2>

          <p className="relative w-[360px]  font-normal text-transparent text-sm tracking-[0] leading-[normal]">
           <span className="font-semibold text-[#f0c419]">uTender.eu</span>
           <span className="text-[#1b2631]"> informon kompani dhe individë për tenderët në Kosovë. Publikojmë të gjithë </span>
           <span className="font-semibold text-[#f0c419]">tenderët aktivë</span>
           <span className=" text-[#1b2631]"> në kohë reale, çdo ditë.</span>
          </p>
         </div>
        </div>

        <div className="flex flex-col w-[406px] items-start gap-2 absolute top-[203px] left-[22px]">
         {bulletPoints.map((point, index) => (
          <div key={index} className="flex items-center gap-[30px] relative self-stretch w-full flex-[0_0_auto]">
           <img className="relative w-3.5 h-3.5" alt="Group" src={point.icon} />
           <div className="mt-[-1.00px] relative flex-1 [font-family:'Gilroy-SemiBold-SemiBold',Helvetica] font-normal text-transparent text-sm tracking-[0] leading-[normal]">
            {point.text}
           </div>
          </div>
         ))}
        </div>

        <Button onClick={() => navigate('/register')} className="inline-flex items-center justify-center gap-[6.71px] px-[22px] py-2 absolute top-[361px] left-[22px] bg-[#f0c419] rounded-lg h-auto hover:bg-[#f0c419]/90">
         <span className="mt-[-1.13px]  font-bold text-[#f0f5ff] text-sm leading-[normal] tracking-[0]">Abonohu</span>
        </Button>
       </div>

       {/* Mobile/Tablet responsive layout */}
       <div className="lg:hidden">
        <img className="w-8 h-8 mb-4" alt="Group" src="/group-1000006883-9.png" />

        <h2 className="text-xl md:text-2xl font-bold text-[#1b2631] mb-3">Cfarë ofron Utender.eu?</h2>

        <p className="text-sm md:text-base mb-6">
         <span className="font-semibold text-[#f0c419]">uTender.eu</span>
         <span className="text-[#1b2631]"> informon kompani dhe individë për tenderët në Kosovë. Publikojmë të gjithë </span>
         <span className="font-semibold text-[#f0c419]">tenderët aktivë</span>
         <span className="text-[#1b2631]"> në kohë reale, çdo ditë.</span>
        </p>

        <div className="space-y-3 mb-6">
         {bulletPoints.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
           <img className="w-3.5 h-3.5 mt-0.5" alt="Group" src={point.icon} />
           <div className="flex-1 text-sm">{point.text}</div>
          </div>
         ))}
        </div>

        <Button onClick={() => navigate('/register')} className="w-full md:w-auto bg-[#f0c419] hover:bg-[#f0c419]/90 px-6 py-2 rounded-lg">
         <span className="font-bold text-[#f0f5ff] text-sm">Abonohu</span>
        </Button>
       </div>
      </CardContent>
     </Card>

     {/* Second Card */}
     <Card className="w-full lg:w-[448px] bg-[#f6f9ff] lg:bg-transparent rounded-xl border-0 shadow-none">
      <CardContent className="p-6 lg:p-0 lg:relative lg:h-[416px]">
       {/* Desktop absolute positioning */}
       <div className="hidden lg:block">
        <div className="absolute top-0 left-0 w-[345px] h-[416px] bg-[#f6f9ff] rounded-xl" />

        <div className="flex flex-col w-[426px] items-start gap-5 absolute top-[22px] left-[22px]">
         <img className="relative w-[37.78px] h-[37.78px]" alt="Group" src="/group-1000006883-8.png" />

         <h2 className="w-[302px] relativefont-bold text-[#1b2631] text-[27px] tracking-[-0.92px] leading-[36.8px]">
          Cfarë tenderë publikohen në Utender.eu
         </h2>
        </div>

        <div className="absolute top-[298px] left-[22px] w-[326px] h-[53px] flex flex-col gap-0.5">
         <p className="w-[322px] h-[17px] font-normal text-transparent text-sm tracking-[0] leading-[normal]">
          <span className="text-[#1b2631]">Ata ndahen në </span>
          <span className=" font-semibold text-[#f0c419]">kategori</span>
          <span className="text-[#1b2631]"> dhe </span>
          <span className=" font-semibold text-[#f0c419]">regjione</span>
          <span className="text-[#1b2631]"> të ndryshme.</span>
         </p>

         <p className="w-72 h-[34px]  font-normal text-[#1b2631] text-sm tracking-[0] leading-[normal]">
          Poashtu ofrohen detaje të tenderëve bashkë me dokumentin zyrtar të publikuar.
         </p>
        </div>

        <Button onClick={() => navigate('/register')} className="inline-flex items-center justify-center gap-[6.71px] px-[22px] py-2 absolute top-[361px] left-[22px] bg-[#f0c419] rounded-lg h-auto hover:bg-[#f0c419]/90">
         <span className="mt-[-1.13px] font-bold text-[#f0f5ff] text-sm leading-[normal] tracking-[0]">Abonohu</span>
        </Button>
       </div>

       {/* Mobile/Tablet responsive layout */}
       <div className="lg:hidden">
        <img className="w-8 h-8 mb-4" alt="Group" src="/group-1000006883-8.png" />

        <h2 className="text-xl md:text-2xl font-bold text-[#1b2631] mb-6">Cfarë tenderë publikohen në Utender.eu</h2>

        <div className="space-y-2 mb-6">
         <p className="text-sm md:text-base">
          <span className="text-[#1b2631]">Ata ndahen në </span>
          <span className="font-semibold text-[#f0c419]">kategori</span>
          <span className="text-[#1b2631]"> dhe </span>
          <span className="font-semibold text-[#f0c419]">regjione</span>
          <span className="text-[#1b2631]"> të ndryshme.</span>
         </p>

         <p className="text-sm md:text-base text-[#1b2631]">Poashtu ofrohen detaje të tenderëve bashkë me dokumentin zyrtar të publikuar.</p>
        </div>

        <Button onClick={() => navigate('/register')} className="w-full md:w-auto bg-[#f0c419] hover:bg-[#f0c419]/90 px-6 py-2 rounded-lg">
         <span className="font-bold text-[#f0f5ff] text-sm">Abonohu</span>
        </Button>
       </div>
      </CardContent>
     </Card>
    </div>
   </div>
  </section>
 );
};
