import { CircleHelp } from "lucide-react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
    const { t } = useTranslation();

    return <div className="w-full rounded-lg pt-10 pb-10 bg-primary">
        <div className="flex flex-col items-center justify-center min-h-[600px] gap-4 text-muted-foreground">
            <CircleHelp className="w-12 h-12" />
            <p className="text-2xl font-bold">{t('404.title')}</p>
            <p className="text-sm">{t('404.description')}</p>
        </div>
    </div>
};

export default NotFound;