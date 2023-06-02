/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  mergeAttributes,
  Node,
  nodeInputRule,
} from '@tiptap/core'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    abbr: {
      /**
       * Set a video node
       */
      setAbbr: (src: string) => ReturnType;
      /**
       * Toggle a video
       */
      toggleAbbr: (src: string) => ReturnType;
    };
  }
}

export interface VideoOptions {
  url: string;
  width: number;
  height: number;
  HTMLAttributes: Record<string, any>;
}


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * Set a video node
       */
      setVideo: (src: string) => ReturnType,
      /**
       * Toggle a video
       */
      toggleVideo: (src: string) => ReturnType,
    }
  }
}

const VIDEO_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/


const Video = Node.create({
  name: 'video',

  group: "block",

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el: any) => (el as HTMLSpanElement).getAttribute('src'),
        renderHTML: (attrs: any) => ({ src: attrs.src }),
      },
      documentId: {
        default: '',
        renderHTML: (attributes: any) => { return {'data-document-id': attributes.documentId}},
        parseHTML: (element: any) => element.getAttribute('data-document-id'),
      },
      isCaptation: {
        default: false,
        renderHTML: (attributes: any) => { return {'data-document-is-captation': attributes.isCaptation}},
        parseHTML: (element: any) => element.getAttribute('data-document-is-captation'),
      },
      videoResolution: {
        default: '404x720',
        renderHTML: (attributes: any) => { return {'data-video-resolution': attributes.videoResolution}},
        parseHTML: (element: any) => element.getAttribute('data-video-resolution'),
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
        getAttrs: (el: any) => ({ src: (el as HTMLVideoElement).getAttribute('src') }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['source', HTMLAttributes]
    ]
  },

  addCommands() {
    return {
      setVideo: (src: string) => ({ commands }) => commands.insertContent(`<video controls="true" style="width: 100%" src="${src}" />`),

      toggleVideo: () => ({ commands }) => commands.toggleNode(this.name, 'paragraph'),
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: VIDEO_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [,, src] = match

          return { src }
        },
      })
    ]
  },
});

export { Video };
export default Video;
