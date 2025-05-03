import { SectionTitleProps } from './interface/props.interface';

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center space-y-2 mb-14">
      <h1 className="text-4xl md:text-5xl font-bold text-green-700">{title}</h1>
      <p className="text-lg md:text-xl text-gray-600 font-medium">{subtitle}</p>
    </div>
  );
}
