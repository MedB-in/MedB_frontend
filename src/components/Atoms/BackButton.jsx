import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../utils/Navigation';
import { ArrowLeft } from 'lucide-react';
const BackButton = () => {
    const { goBackAndNavigate } = useNavigation();
    const navigate = useNavigate();

    const handleBack = () => {
        const previousPath = goBackAndNavigate();
        navigate(previousPath || '/app');
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-[#6F64E7] hover:text-[#4f46e5] font-medium transition-all duration-200 group mt-2 mb-5"
        >
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back</span>
        </button>
    );
};

export default BackButton;
