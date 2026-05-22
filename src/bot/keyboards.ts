export function mainKeyboard() {
  return {
    inline_keyboard: [
      [{ text: 'Check membership', callback_data: 'check_membership' }],
      [{ text: 'My referral link', callback_data: 'my_referral_link' }],
      [{ text: 'My status', callback_data: 'my_status' }],
      [{ text: 'Claim reward', callback_data: 'claim_reward' }],
      [{ text: 'Help', callback_data: 'help' }]
    ]
  };
}
