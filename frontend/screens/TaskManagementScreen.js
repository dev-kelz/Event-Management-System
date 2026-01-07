import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const TaskManagementScreen = ({ route, navigation }) => {
  const { eventId, eventTitle } = route.params;
  const [tasks, setTasks] = useState([]);
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    stage_id: null
  });

  useEffect(() => {
    loadCurrentUser();
    fetchEventDetails();
    fetchStages();
    fetchTasks();
  }, [eventId]);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
      const data = await response.json();
      if (data.success && data.event) {
        setEvent(data.event);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  useEffect(() => {
    if (currentUser && event) {
      setIsOrganizer(event.created_by === currentUser.id);
    }
  }, [currentUser, event]);

  // Stage configurations with images and colors
  const stageConfigs = {
    'Planning': {
      icon: 'clipboard-outline',
      color: '#4A90E2',
      gradient: ['#4A90E2', '#357ABD'],
      emoji: '📋'
    },
    'Promotion': {
      icon: 'megaphone-outline',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706'],
      emoji: '📢'
    },
    'Execution': {
      icon: 'rocket-outline',
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      emoji: '🚀'
    },
    'Post-Event': {
      icon: 'checkmark-done-circle-outline',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED'],
      emoji: '✅'
    }
  };

  const fetchStages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stages`);
      const data = await response.json();
      if (data.success) {
        setStages(data.stages);
        
        // Initialize default stages if none exist
        if (data.stages.length === 0) {
          await initializeDefaultStages();
        }
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
      // Use default stages offline
      setStages([
        { id: 1, name: 'Planning', order: 0 },
        { id: 2, name: 'Promotion', order: 1 },
        { id: 3, name: 'Execution', order: 2 },
        { id: 4, name: 'Post-Event', order: 3 }
      ]);
    }
  };

  const initializeDefaultStages = async () => {
    const defaultStages = [
      { name: 'Planning', description: 'Planning and preparation phase', order: 0 },
      { name: 'Promotion', description: 'Marketing and promotion phase', order: 1 },
      { name: 'Execution', description: 'Event execution phase', order: 2 },
      { name: 'Post-Event', description: 'Post-event follow-up', order: 3 }
    ];

    try {
      for (const stage of defaultStages) {
        await fetch(`${API_BASE_URL}/api/stages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stage)
        });
      }
      await fetchStages();
    } catch (error) {
      console.error('Error creating default stages:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const url = selectedStage
        ? `${API_BASE_URL}/api/events/${eventId}/tasks?stage_id=${selectedStage}`
        : `${API_BASE_URL}/api/events/${eventId}/tasks`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Use dummy data for offline mode
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          stage_id: newTask.stage_id,
          created_by: 1 // Replace with actual user ID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Success', 'Task created successfully');
        setModalVisible(false);
        setNewTask({ title: '', description: '', priority: 'medium', stage_id: null });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/toggle`, {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: 'DELETE'
              });

              const data = await response.json();
              
              if (data.success) {
                fetchTasks();
              }
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA500';
      case 'low': return '#4CAF50';
      default: return '#999';
    }
  };

  const getTasksByStage = (stageId) => {
    return tasks.filter(task => task.stage_id === stageId);
  };

  const renderTask = (task) => (
    <View key={task.id} style={styles.taskCard}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => handleToggleTask(task.id)}
      >
        <View style={styles.taskHeader}>
          <View style={styles.checkboxContainer}>
            <Ionicons
              name={task.is_completed ? "checkbox" : "square-outline"}
              size={24}
              color={task.is_completed ? "#4CAF50" : "#999"}
            />
          </View>
          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                task.is_completed && styles.completedTask
              ]}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text style={styles.taskDescription} numberOfLines={2}>
                {task.description}
              </Text>
            )}
            <View style={styles.taskMeta}>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(task.priority) }
                ]}
              >
                <Text style={styles.priorityText}>{task.priority}</Text>
              </View>
              {task.due_date && (
                <View style={styles.dueDateContainer}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.dueDateText}>
                    {new Date(task.due_date).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(task.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  const renderStageSection = (stage) => {
    const stageTasks = getTasksByStage(stage.id);
    const completedTasks = stageTasks.filter(t => t.is_completed).length;
    const totalTasks = stageTasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const config = stageConfigs[stage.name] || stageConfigs['Planning'];

    return (
      <View key={stage.id} style={styles.stageSection}>
        <View style={[styles.stageHeaderCard, { borderLeftColor: config.color }]}>
          <View style={styles.stageHeaderTop}>
            <View style={styles.stageIconContainer}>
              <View style={[styles.stageIconCircle, { backgroundColor: config.color }]}>
                <Ionicons name={config.icon} size={24} color="#fff" />
              </View>
              <View style={styles.stageTitleContainer}>
                <Text style={styles.stageEmoji}>{config.emoji}</Text>
                <Text style={styles.stageName}>{stage.name}</Text>
              </View>
            </View>
            <View style={styles.stageStatsContainer}>
              <Text style={styles.stageProgress}>
                {completedTasks}/{totalTasks}
              </Text>
              <Text style={styles.stageProgressLabel}>completed</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progress}%`, backgroundColor: config.color }
              ]} 
            />
          </View>
        </View>
        {stageTasks.length > 0 ? (
          stageTasks.map(renderTask)
        ) : (
          <View style={styles.emptyStage}>
            <Ionicons name={config.icon} size={40} color="#E5E5E5" />
            <Text style={styles.emptyText}>No tasks in this stage yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first task</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Task Management</Text>
          <Text style={styles.headerSubtitle}>{eventTitle}</Text>
        </View>
      </View>

      {/* Stage Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.stageFilter}
        contentContainerStyle={styles.stageFilterContent}
      >
        <TouchableOpacity
          style={[
            styles.stageFilterButton,
            selectedStage === null && styles.activeStageFilter
          ]}
          onPress={() => {
            setSelectedStage(null);
            fetchTasks();
          }}
        >
          <Text
            style={[
              styles.stageFilterText,
              selectedStage === null && styles.activeStageFilterText
            ]}
          >
            All Stages
          </Text>
        </TouchableOpacity>
        {stages.map(stage => (
          <TouchableOpacity
            key={stage.id}
            style={[
              styles.stageFilterButton,
              selectedStage === stage.id && styles.activeStageFilter
            ]}
            onPress={() => {
              setSelectedStage(stage.id);
              fetchTasks();
            }}
          >
            <Text
              style={[
                styles.stageFilterText,
                selectedStage === stage.id && styles.activeStageFilterText
              ]}
            >
              {stage.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List */}
      {!isOrganizer ? (
        <View style={styles.noAccessContainer}>
          <Ionicons name="lock-closed-outline" size={64} color="#ccc" />
          <Text style={styles.noAccessTitle}>Access Restricted</Text>
          <Text style={styles.noAccessText}>
            Only event organizers can manage tasks.
          </Text>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {selectedStage === null ? (
              stages.map(renderStageSection)
            ) : (
              <View style={styles.filteredTasksContainer}>
                {tasks.length > 0 ? (
                  tasks.map(renderTask)
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="checkmark-done-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyStateText}>No tasks found</Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Add Task Button */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      {/* Create Task Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Task</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Stage</Text>
            <View style={styles.stageSelector}>
              {stages.map(stage => (
                <TouchableOpacity
                  key={stage.id}
                  style={[
                    styles.stageOption,
                    newTask.stage_id === stage.id && styles.selectedStageOption
                  ]}
                  onPress={() => setNewTask({ ...newTask, stage_id: stage.id })}
                >
                  <Text
                    style={[
                      styles.stageOptionText,
                      newTask.stage_id === stage.id && styles.selectedStageOptionText
                    ]}
                  >
                    {stage.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Priority</Text>
            <View style={styles.prioritySelector}>
              {['low', 'medium', 'high'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityOption,
                    newTask.priority === priority && styles.selectedPriorityOption,
                    { borderColor: getPriorityColor(priority) }
                  ]}
                  onPress={() => setNewTask({ ...newTask, priority })}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      newTask.priority === priority && { color: getPriorityColor(priority) }
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTask}
            >
              <Text style={styles.createButtonText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  stageFilter: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  stageFilterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stageFilterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  activeStageFilter: {
    backgroundColor: '#000',
  },
  stageFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeStageFilterText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  stageSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  stageHeaderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  stageHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stageIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stageIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageEmoji: {
    fontSize: 20,
  },
  stageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  stageStatsContainer: {
    alignItems: 'flex-end',
  },
  stageProgress: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  stageProgressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyStage: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#BBB',
    marginTop: 4,
  },
  filteredTasksContainer: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  stageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  stageOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F8F9FA',
  },
  selectedStageOption: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  stageOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedStageOptionText: {
    color: '#fff',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedPriorityOption: {
    backgroundColor: '#F8F9FA',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  createButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F8F9FA',
  },
  noAccessTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  noAccessText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  goBackButton: {
    backgroundColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskManagementScreen;
