import React, { useRef } from 'react';
import { Certificate } from '../../types';
import { CIB_LOGO_URL } from '../../data/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { Award, Printer, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface CertificateCardProps {
  certificate: Certificate;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div
        ref={certRef}
        className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border-8 border-cib-green-900 shadow-2xl relative overflow-hidden print-only-container"
      >
        {/* Decorative Gold Inset Border */}
        <div className="border-2 border-cib-gold-400 p-6 sm:p-10 rounded-xl relative text-center space-y-6">
          {/* Top Crest */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <img
              src={CIB_LOGO_URL}
              alt="CIB Ghana Crest"
              className="h-16 sm:h-20 w-auto object-contain"
            />
            <h2 className="text-sm sm:text-base font-extrabold tracking-widest text-cib-green-900 uppercase font-display">
              Chartered Institute of Bankers, Ghana
            </h2>
            <div className="h-0.5 w-24 bg-cib-gold-400 mx-auto" />
          </div>

          {/* Certificate Title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-cib-charcoal-900 font-display tracking-tight uppercase">
              Certificate of Participation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-serif italic">
              This is to officially certify that
            </p>
          </div>

          {/* Recipient Name */}
          <div className="py-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-cib-green-900 border-b-2 border-slate-300 pb-2 inline-block min-w-[300px] font-display">
              {certificate.recipient_name}
            </h3>
          </div>

          {/* Event Statement */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            has successfully participated and contributed to the proceedings of the
          </p>

          <h4 className="text-lg sm:text-xl font-bold text-cib-charcoal-900 font-display px-4">
            {certificate.event_title}
          </h4>

          <p className="text-xs text-slate-500">
            Convened on <strong>{certificate.event_date}</strong> under the auspices of CIB Ghana.
          </p>

          {/* Bottom Signatures & QR Code */}
          <div className="pt-8 grid grid-cols-3 items-end gap-4 border-t border-slate-200">
            {/* Signature 1 */}
            <div className="text-center">
              <div className="font-serif italic text-sm text-slate-800 border-b border-slate-300 pb-1 mx-auto max-w-[150px]">
                Robert Dzato
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-cib-charcoal-800 mt-1 uppercase">
                Chief Executive Officer
              </p>
              <p className="text-[9px] text-slate-400">CIB Ghana</p>
            </div>

            {/* Verification QR */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-1 rounded-lg border border-slate-200">
                <QRCodeSVG value={certificate.verification_url} size={64} />
              </div>
              <p className="font-mono text-[9px] text-slate-400 mt-1">
                {certificate.certificate_number}
              </p>
            </div>

            {/* Signature 2 */}
            <div className="text-center">
              <div className="font-serif italic text-sm text-slate-800 border-b border-slate-300 pb-1 mx-auto max-w-[150px]">
                Benjamin Amenumey
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-cib-charcoal-800 mt-1 uppercase">
                President of Council
              </p>
              <p className="text-[9px] text-slate-400">CIB Ghana</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center no-print">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={handlePrint}
        >
          Print Official Certificate
        </Button>
      </div>
    </div>
  );
};
