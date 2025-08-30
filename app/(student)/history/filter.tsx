import { BottomSheetModalUi, Button, Picker } from '@/godui';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

interface FilterProps {
    bottomSheetRef: React.RefObject<BottomSheetModal | null>;
    onFilterChange?: (data: {year: string, semester: string, course: string}) => void;
}

const Filter = ({ bottomSheetRef, onFilterChange }: FilterProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = React.useState({
        year: "all",
        semester: "all",
        course: "all",
    })

    const handleChange = (key: string, value: string | number) => {
        setFormData({ ...formData, [key]: value })
    }

    const handleSubmit = () => {
        onFilterChange?.(formData)
        bottomSheetRef.current?.close()
    }

    const snapPoints = ["50%"]  ;
    const years = [
        { label: t('all'), value: "all" },
        { label: t('yearOne'), value: "1" },
        { label: t('yearTwo'), value: "2" },
        { label: t('yearThree'), value: "3" },
        { label: t('yearFour'), value: "4" },
    ];
    const semesters = [
        { label: t('all'), value: "all" },
        { label: t('semesterOne'), value: "1" },
        { label: t('semesterTwo'), value: "2" },
    ];
    const courses = [
        { label: t('all'), value: "all" },
        { label: t('databaseManagementSystem'), value: "1" },
        { label: t('dataStructure'), value: "2" },
    ];
    return (
        <BottomSheetModalUi
            blurIntensity={90}
            bottomSheetRef={bottomSheetRef}
            hideHandle
            snapPoints={snapPoints}
            index={0}
        >
            <View className='flex-1 px-4 gap-2'>
                <Picker options={years} label={t('year')} variant='solid' placeholder={t('chooseYear')} value={formData.year} onChange={(value) => handleChange("year", value)}/>
                <Picker options={semesters} label={t('semester')} variant='solid' placeholder={t('chooseSemester')} value={formData.semester} onChange={(value) => handleChange("semester", value)}/>
                <Picker options={courses} label={t('course')} variant='solid' placeholder={t('chooseCourse')} value={formData.course} onChange={(value) => handleChange("course", value)} placement='top'/>
                <View className='flex-row items-center gap-2 mt-4'>
                    <Button
                        label={t('apply')}
                        onPress={handleSubmit}
                        className="flex-1"
                        color='primary'
                        size='md'
                    />
                    <Button
                        label={t('reset')}
                        onPress={() => setFormData({ year: "all", semester: "all", course: "all" })}
                        startContent={<Ionicons name="refresh-outline" size={24} color="#db2777" />}
                        className="flex-1"
                        color='danger'
                        variant='flat'
                        size='md'
                    />
                </View>
            </View>
        </BottomSheetModalUi>
    );
}

export default Filter
