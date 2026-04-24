import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeFocus } from '@/api/focusApi.js';
import handleApiError from '@/utils/handleApiError.jsx';

export function useCompleteFocus(studyId, onSessionComplete) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionPayload) => {
      return completeFocus(studyId, {
        sessionData: sessionPayload,
      });
    },

    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['focus', studyId] });
      queryClient.invalidateQueries({ queryKey: ['point', studyId] });
      queryClient.invalidateQueries({ queryKey: ['study', studyId] });
      queryClient.invalidateQueries({ queryKey: ['studies'] });

      onSessionComplete?.(result);
    },

    onError: (err) => {
      if (err.status === 401) {
        window.dispatchEvent(
          new CustomEvent('session-expired', { detail: { studyId } })
        );
        return;
      }

      handleApiError(err, '집중 세션 저장에 실패했습니다.');
    },
  });
}
