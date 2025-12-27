import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  
  //LANDING PAGE
  
  authStatusBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  authStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  userBadgeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  logoutBtnText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    gap: 8,
  },
  signInBtnText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  
  heroSection: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  logoBlack: {
    color: '#2C2C2E',
  },
  logoOrange: {
    color: '#FF6B35',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '400',
  },
  
  languageContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  langButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 50,
    paddingHorizontal: 60,
    borderRadius: 28,
    minWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 8,
  },
  langText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  langTextBlue: {
    color: '#3B82F6',
  },
  
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: -32,
    zIndex: 10,
  },
  swapButton: {
    backgroundColor: '#FF6B35',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  
  featuresSection: {
    marginTop: 50,
    marginBottom: 30,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureItemText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
  },
  
  startButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  startButton: {
    width: width - 80,
    paddingVertical: 20,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  
  footerNote: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  
  //TRANSLATION PAGE
  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  logoSmall: {
    fontSize: 28,
    fontWeight: '700',
  },
  homeButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  userBadgeSmallText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  
  contextSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  contextIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contextInfo: {
    flex: 1,
  },
  contextValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  contextSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  confidenceText: {
    fontWeight: '700',
  },
  
  signalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  signalEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  signalText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  input: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  output: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    lineHeight: 24,
  },
  outputPlaceholder: {
    color: '#D1D5DB',
  },
  counter: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  
  swapArrowContainer: {
    alignItems: 'center',
    marginVertical: -12,
    zIndex: 10,
  },
  swapArrowButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  clearButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  translateButton: {
    backgroundColor: '#8B5CF6',
  },
  homeActionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  buttonLabelWhite: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  contextList: {
    maxHeight: 450,
  },
  contextOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contextOptionActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  contextOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contextIcon: {
    fontSize: 26,
  },
  contextTextBox: {
    flex: 1,
  },
  contextName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contextDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  contentWeb: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  containerWeb: {
    maxWidth: 700,
    width: '100%',
  },
  langButtonWeb: {
    minWidth: 350,
    paddingVertical: 55,
  },
  startButtonWeb: {
    maxWidth: 500,
  },
  modalContentWeb: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '90%',
    borderRadius: 28,
    marginBottom: 40,
  },
});

export const authStyles = {
  authContainer: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  backButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  authLogo: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  authSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    position: 'relative',
  },

  inputIcon: {
    marginRight: 10,
  },

  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
  },

  inputFieldFocused: {
    borderColor: '#8B5CF6',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
  },

  eyeButton: {
    padding: 8,
  },

  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },

  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },

  switchText: {
    fontSize: 15,
    color: '#6B7280',
  },

  switchLink: {
    fontSize: 15,
    color: '#8B5CF6',
    fontWeight: '700',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 16,
    fontWeight: '500',
  },

  continueButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  continueButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
};