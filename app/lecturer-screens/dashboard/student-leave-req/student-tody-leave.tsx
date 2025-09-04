import { Entypo, Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';

import { Alert, Avatar, Button, Card, Icon, Text, useDisclosure, useHaptic, useToast } from '@/godui';
import { useThemeStore } from '@/stores/useThemeStore';

// Constants
const ANIMATION_DELAYS = {
  HEADER: 0,
  STATS: 100,
  FILTERS: 200,
  ITEM_BASE: 100,
  ITEM_STAGGER: 60,
} as const;

const STATUS_CONFIG = {
  Pending: {
    color: '#F59E0B',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-700 dark:text-amber-400',
    icon: 'time-outline' as const,
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  Approved: {
    color: '#10B981',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    icon: 'checkmark-circle' as const,
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  Rejected: {
    color: '#EF4444',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-400',
    icon: 'close-circle' as const,
    borderColor: 'border-red-200 dark:border-red-800',
  },
} as const;

// Types
type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

interface LeaveRequest {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  year: string;
  reason: string;
  date: string;
  time: string;
  status: LeaveStatus;
  avatar: string;
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  priority?: 'Low' | 'Medium' | 'High';
  duration?: string;
}

interface FilterOption {
  label: string;
  value: LeaveStatus | 'All';
  count: number;
  color?: string;
}

interface ActionState {
  selectedId: string | null;
  type: 'approve' | 'reject' | null;
}

// Enhanced mock data
const generateMockRequests = (): LeaveRequest[] => [
  {
    id: '1',
    name: 'Ayesha Khan',
    rollNo: '2021-CS-001',
    department: 'Computer Science',
    year: '3rd Year',
    reason: 'Medical appointment with specialist for follow-up consultation',
    date: '2024-06-12',
    time: '09:00 AM',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/400?img=68',
    submittedAt: '2024-06-12T08:00:00Z',
    priority: 'High',
    duration: '2 hours',
  },
  {
    id: '2',
    name: 'Ali Raza',
    rollNo: '2021-EE-023',
    department: 'Electrical Engineering',
    year: '2nd Year',
    reason: 'Family emergency - grandmother hospitalized',
    date: '2024-06-12',
    time: '10:30 AM',
    status: 'Approved',
    avatar: 'https://i.pravatar.cc/400?img=67',
    submittedAt: '2024-06-12T09:00:00Z',
    processedAt: '2024-06-12T09:15:00Z',
    processedBy: 'Dr. Smith',
    priority: 'High',
    duration: 'Full day',
  },
  {
    id: '3',
    name: 'Fatima Noor',
    rollNo: '2021-BBA-015',
    department: 'Business Administration',
    year: '1st Year',
    reason: 'Personal work - bank documentation',
    date: '2024-06-12',
    time: '11:15 AM',
    status: 'Rejected',
    avatar: 'https://i.pravatar.cc/400?img=66',
    submittedAt: '2024-06-12T10:00:00Z',
    processedAt: '2024-06-12T10:30:00Z',
    processedBy: 'Prof. Johnson',
    priority: 'Low',
    duration: '3 hours',
  },
  {
    id: '4',
    name: 'Hassan Ahmed',
    rollNo: '2021-ME-045',
    department: 'Mechanical Engineering',
    year: '4th Year',
    reason: 'Job interview at leading tech company',
    date: '2024-06-12',
    time: '02:00 PM',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/400?img=65',
    submittedAt: '2024-06-12T11:00:00Z',
    priority: 'Medium',
    duration: '4 hours',
  },
  {
    id: '5',
    name: 'Sara Ali',
    rollNo: '2021-CS-078',
    department: 'Computer Science',
    year: '2nd Year',
    reason: 'Academic conference presentation',
    date: '2024-06-12',
    time: '03:30 PM',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/400?img=64',
    submittedAt: '2024-06-12T12:00:00Z',
    priority: 'Medium',
    duration: '6 hours',
  },
];

const StudentTodayLeave: React.FC = () => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { trigger } = useHaptic();
  const { show } = useToast();
  const theme = useThemeStore((state) => state.theme);
  
  // Modal states
  const alertApprove = useDisclosure();
  const alertReject = useDisclosure();

  // Component state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(generateMockRequests);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<LeaveStatus | 'All'>('All');
  const [actionState, setActionState] = useState<ActionState>({ selectedId: null, type: null });
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Computed values
  const primaryColor = theme === "1" ? "bg-theme1-primary" : "bg-theme2-primary";
  
  const filteredRequests = useMemo(() => {
    if (selectedFilter === 'All') return leaveRequests;
    return leaveRequests.filter(request => request.status === selectedFilter);
  }, [leaveRequests, selectedFilter]);

  const stats = useMemo(() => {
    const total = leaveRequests.length;
    const pending = leaveRequests.filter(r => r.status === 'Pending').length;
    const approved = leaveRequests.filter(r => r.status === 'Approved').length;
    const rejected = leaveRequests.filter(r => r.status === 'Rejected').length;
    
    return { total, pending, approved, rejected };
  }, [leaveRequests]);

  const filterOptions: FilterOption[] = useMemo(() => [
    { label: t('all') || 'All', value: 'All', count: stats.total },
    { label: t('pending') || 'Pending', value: 'Pending', count: stats.pending, color: STATUS_CONFIG.Pending.color },
    { label: t('approved') || 'Approved', value: 'Approved', count: stats.approved, color: STATUS_CONFIG.Approved.color },
    { label: t('rejected') || 'Rejected', value: 'Rejected', count: stats.rejected, color: STATUS_CONFIG.Rejected.color },
  ], [stats, t]);

  // Handlers
  const handleHapticFeedback = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    const styleMap = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    };
    trigger(styleMap[intensity]);
  }, [trigger]);

  const showActionToast = useCallback((action: string, studentName: string, success: boolean = true) => {
    show({
      type: success ? 'success' : 'error',
      title: success ? `Leave ${action}` : 'Action Failed',
      message: success 
        ? `${studentName}'s leave request has been ${action.toLowerCase()}`
        : `Failed to ${action.toLowerCase()} ${studentName}'s request. Please try again.`,
      position: 'top',
      duration: 3500,
    });
  }, [show]);

  const updateLeaveStatus = useCallback((id: string, newStatus: LeaveStatus, action: string) => {
    setIsProcessing(id);
    
    // Simulate processing delay
    setTimeout(() => {
      setLeaveRequests(prev => {
        const updated = prev.map(req => {
          if (req.id === id) {
            showActionToast(action, req.name, true);
            return {
              ...req,
              status: newStatus,
              processedAt: new Date().toISOString(),
              processedBy: 'Current User', // In production, use actual user name
            };
          }
          return req;
        });
        return updated;
      });
      
      setIsProcessing(null);
      setActionState({ selectedId: null, type: null });
    }, 2000);
  }, [showActionToast]);

  const handleApprove = useCallback((id: string) => {
    setActionState({ selectedId: id, type: 'approve' });
    alertApprove.onOpen();
  }, [alertApprove]);

  const handleReject = useCallback((id: string) => {
    setActionState({ selectedId: id, type: 'reject' });
    alertReject.onOpen();
  }, [alertReject]);

  const confirmApprove = useCallback(() => {
    if (actionState.selectedId) {
      handleHapticFeedback('medium');
      updateLeaveStatus(actionState.selectedId, 'Approved', 'Approved');
      alertApprove.onClose();
    }
  }, [actionState.selectedId, handleHapticFeedback, updateLeaveStatus, alertApprove]);

  const confirmReject = useCallback(() => {
    if (actionState.selectedId) {
      handleHapticFeedback('medium');
      updateLeaveStatus(actionState.selectedId, 'Rejected', 'Rejected');
      alertReject.onClose();
    }
  }, [actionState.selectedId, handleHapticFeedback, updateLeaveStatus, alertReject]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    handleHapticFeedback();
    
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLeaveRequests(generateMockRequests());
      show({
        type: 'success',
        title: 'Refreshed',
        message: 'Leave requests have been updated',
        position: 'top',
        duration: 3500,
      });
    } catch (error) {
      show({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Unable to refresh data. Please try again.',
        position: 'top',
        duration: 3500,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [handleHapticFeedback, show]);

  const handleGoBack = useCallback(() => {
    handleHapticFeedback();
    router.back();
  }, [handleHapticFeedback]);

  const handleViewDetails = useCallback((request: LeaveRequest) => {
    handleHapticFeedback();
    console.log('View details for:', request.name);
  }, [handleHapticFeedback]);

  const handleFilterSelect = useCallback((filter: LeaveStatus | 'All') => {
    handleHapticFeedback();
    setSelectedFilter(filter);
  }, [handleHapticFeedback]);

  // Render methods
  const renderStatsCard = () => (
    <MotiView className="mx-4 mb-4">
      <View className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-lg shadow-zinc-200/50 dark:shadow-black/50">
        <Text className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">
          Today's Overview
        </Text>
        <View className="flex-row justify-between px-5">
          <View className="items-center">
            <Text className="text-2xl font-bold text-amber-600">{stats.pending}</Text>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">Pending</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-emerald-600">{stats.approved}</Text>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">Approved</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-red-600">{stats.rejected}</Text>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">Rejected</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</Text>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">Total</Text>
          </View>
        </View>
      </View>
    </MotiView>
  );

  const renderFilterChip = ({ item: filter }: { item: FilterOption }) => {
    const isSelected = selectedFilter === filter.value;
    
    return (
      <TouchableOpacity
        onPress={() => handleFilterSelect(filter.value)}
        activeOpacity={0.7}
        className={`px-4 py-2 rounded-full mr-3 flex-row items-center ${
          isSelected
            ? `${primaryColor}`
            : 'bg-zinc-100 dark:bg-zinc-700'
        }`}
      >
        {filter.color && isSelected && (
          <View 
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: filter.color }}
          />
        )}
        <Text
          className={`font-semibold ${
            isSelected
              ? 'text-white'
              : 'text-zinc-700 dark:text-zinc-300'
          }`}
        >
          {filter.label}
        </Text>
        {filter.count > 0 && (
          <View
            className={`ml-2 p-0.5 rounded-full min-w-[20px] items-center ${
              isSelected
                ? 'bg-white/20'
                : 'bg-zinc-200 dark:bg-zinc-600'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                isSelected
                  ? 'text-white'
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {filter.count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };


  const renderLeaveItem = ({ item, index }: { item: LeaveRequest; index: number }) => {
    const statusConfig = STATUS_CONFIG[item.status];
    const isProcessingItem = isProcessing === item.id;
    
    return (
      <Card
        animation={{
          type: 'timing',
          duration: 500,
          delay: ANIMATION_DELAYS.ITEM_BASE + (index * ANIMATION_DELAYS.ITEM_STAGGER),
          isFocused: isFocused,
        }}
        classNames={{wrapper: 'mx-4 mb-4 dark:bg-zinc-800'}}
        isShadow
        radius="xl"
      >
        <TouchableOpacity
          onPress={() => handleViewDetails(item)}
          activeOpacity={0.96}
          disabled={isProcessingItem}
          className={`${
            isProcessingItem ? 'opacity-70' : ''
          }`}
        >
          <View>
            {/* Header Section */}
            <View className="flex-row items-start justify-between mb-4 border-b border-zinc-200 dark:border-zinc-600 pb-4">
              <View className="flex-row items-center flex-1 mr-3">
                <Avatar uri={item.avatar} size="md" className="mr-4" />
                <View className="flex-1">
                  <View className="flex-row">
                    <View className="flex-row items-center mb-1 flex-1">
                      <Text className="text-lg font-bold text-zinc-900 dark:text-white" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Entypo name="dot-single" size={30} color={statusConfig.color} />
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                        {item.time}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    {item.rollNo}
                  </Text>
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.department} • {item.year}
                  </Text>
                </View>
              </View>
            </View>

            {/* Details Section */}
            <View>
              <View className="flex-row items-center mb-3">
                <View className="flex-row items-center flex-1">
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-2">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
                
                
              </View>
              
              {item.duration && (
                <View className="flex-row items-center mb-3">
                  <Ionicons name="hourglass-outline" size={16} color="#6B7280" />
                  <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-2">
                    Duration: {item.duration}
                  </Text>
                </View>
              )}
              
              <View className="flex-row items-start">
                <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                <View className="ml-2 flex-1 flex-col gap-2">
                  <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Reason:
                  </Text>
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400 leading-5">
                    {item.reason}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons for Pending Requests */}
            {item.status === 'Pending' && (
              <AnimatePresence>
                <MotiView
                  from={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'timing', duration: 300 }}
                  className='mt-4'
                >
                  <View className="flex-row gap-3">
                    <Button
                      onPress={() => handleReject(item.id)}
                      color="danger"
                      className="flex-1"
                      size="sm"
                      radius="full"
                      isLoading={isProcessingItem}
                      startContent={<Ionicons name="close-circle" size={16} color="white" />}
                      label={t('reject') || 'Reject'}
                    />
                    
                    <Button
                      onPress={() => handleApprove(item.id)}
                      color="success"
                      className="flex-1"
                      size="sm"
                      radius="full"
                      isLoading={isProcessingItem}
                      startContent={<Ionicons name="checkmark-circle" size={16} color="white" />}
                      label={t('approve') || 'Approve'}
                    />
                  </View>
                </MotiView>
              </AnimatePresence>
            )}

            {/* Processed Information */}
            {item.status !== 'Pending' && item.processedAt && (
              <View className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-600">
                <View className="flex-row items-center">
                  <Ionicons name="person-circle-outline" size={14} color="#6B7280" />
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
                    {item.status} on {new Date(item.processedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} 
                    {item.processedBy && ` by ${item.processedBy}`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500, delay: 300 }}
      className="flex-1 items-center justify-center px-8 py-20"
    >
      <View className="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-3xl mb-6">
        <Ionicons name="document-text-outline" size={56} color="#6B7280" />
      </View>
      <Text className="text-xl font-bold text-zinc-800 dark:text-zinc-200 text-center mb-3">
        No Leave Requests
      </Text>
      <Text className="text-zinc-500 dark:text-zinc-400 text-center text-base leading-6 max-w-64">
        {selectedFilter === 'All' 
          ? "No leave requests have been submitted for today. Students can submit requests through the mobile app."
          : `No ${selectedFilter.toLowerCase()} leave requests found. Try selecting a different filter.`}
      </Text>
    </MotiView>
  );

  return (
    <>
      {/* Confirmation Modals */}
      <Alert
        visible={alertApprove.isOpen}
        title={t('approveLeave')}
        message="Are you sure you want to approve this leave request? This action will notify the student immediately."
        onConfirm={confirmApprove}
        onCancel={alertApprove.onClose}
        confirmText={t('approve')}
        cancelText={t('cancel')}
      />
      
      <Alert
        visible={alertReject.isOpen}
        title={t('rejectLeave')}
        message="Are you sure you want to reject this leave request? Please ensure you have valid reasons for rejection."
        onConfirm={confirmReject}
        onCancel={alertReject.onClose}
        confirmText={t('reject')}
        cancelText={t('cancel')}
      />

      <View className="flex-1 bg-zinc-50 dark:bg-zinc-900">
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : -30 }}
          transition={{ type: 'timing', duration: 500, delay: ANIMATION_DELAYS.HEADER }}
          className="bg-white dark:bg-zinc-900 pt-12 pb-6 px-4"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                onPress={handleGoBack}
                activeOpacity={0.7}
                className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-xl mr-4"
              >
                <Icon name="chevron-back" size={20} />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                  {t('leaveRequest')}
                </Text>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Filter Chips */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 20 }}
            transition={{ type: 'timing', duration: 400, delay: ANIMATION_DELAYS.FILTERS }}
          >
            <FlatList
              data={filterOptions}
              renderItem={renderFilterChip}
              keyExtractor={(item) => item.value}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            />
          </MotiView>
        </MotiView>

        {/* Content */}
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderLeaveItem}
          ListHeaderComponent={renderStatsCard}
          contentContainerStyle={{ 
            paddingTop: 16, 
            flexGrow: 1 
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#6B7280"
              colors={["#6B7280"]}
              size={2}
            />
          }
          ListEmptyComponent={renderEmptyState}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={10}
          initialNumToRender={6}
          getItemLayout={(data, index) => ({
            length: 200, // Approximate item height
            offset: 200 * index,
            index,
          })}
        />
      </View>
    </>
  );
};

export default StudentTodayLeave;