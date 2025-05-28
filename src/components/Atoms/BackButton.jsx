import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../utils/Navigation';

const BackButton = () => {
    const { goBackAndNavigate } = useNavigation();
    const navigate = useNavigate();

    const handleBack = () => {
        const previousPath = goBackAndNavigate();
        navigate(previousPath || '/app');
    };

    return (
        <p
            className="text-sm self-start pl-1 underline font-bold text-[#7a5fd3] cursor-pointer"
            onClick={handleBack}
        >
            {'<'} Back
        </p>
    );
};

export default BackButton;
