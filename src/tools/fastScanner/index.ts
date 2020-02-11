interface WordTreeNode {
  val: string | null;
  back: WordTreeNode | null;
  parent: WordTreeNode | null;
  accept: boolean;
  next: WordTreeNode | null;
}

/**
 * 敏感词扫描
 */
export class FastScanner {
  public root: WordTreeNode;

  constructor(words: string[]) {
    this.BuildTree(words);
  }

  /**
   * 构建词汇树
   * @param words string[]
   */
  private BuildTree(words: string[]) {
    words = this.DedupAndSort(words);
    const root: WordTreeNode = {
      next: {} as WordTreeNode,
      val: null,
      back: null,
      parent: null,
      accept: false,
    };
    for (let i = 0; i < words.length; i++) {
      this.AddWord(root, words[i]);
    }
    this.FallBackAll(root);
    this.root = root;
  }

  /**
   * 词汇去重
   * @param words string[]
   */
  private DedupAndSort(words: string[]): string[] {
    // 去除每个词汇的空格
    words = words.map(item => {
      return item.trim();
    });
    // 去除空串
    words = words.filter(item => {
      return item.length > 0;
    });

    const seen = {};
    const out = [];
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!seen[word]) {
        seen[word] = true;
        out[out.length] = word;
      }
    }
    return out.sort();
  }

  private AddWord(root: WordTreeNode, word: string) {
    let currnt = root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const next = currnt.next[char];
      if (!next) {
        currnt.next[char] = {
          next: {},
          val: char,
          accept: false,
          back: root,
          parent: currnt,
        };
      }
      currnt = currnt.next[char];
    }
    currnt.accept = true;
  }

  private FallBackAll(root: WordTreeNode) {
    let currentExpands = Object.values(root.next);
    while (currentExpands.length > 0) {
      const nextExpands = [];
      for (let i = 0; i < currentExpands.length; i++) {
        const node: WordTreeNode = currentExpands[i];
        for (const c in node.next) {
          nextExpands.push(node.next[c]);
        }
        const parent = node.parent;
        let back = parent.back;
        while (back !== null) {
          const child = back.next[node.val];
          if (child) {
            node.back = child;
            break;
          }
          back = back.back;
        }
      }
      currentExpands = nextExpands;
    }
  }

  private FallBack(root: WordTreeNode, word: string) {
    let current = root.next[word[0]];
    for (var i = 1; i < word.length; i++) {
      const c = word[i];
      const parent = current.parent;
      let back = parent.back;
      while (back != null) {
        // 匹配父节点的跳跃节点的子节点
        const child = back.next[current.val];
        if (child) {
          current.back = child;
          break;
        }
        back = back.back;
      }
      current = current.next[c];
    }
  }

  private selectLongest(offsetWords: any[][]) {
    const stands = {};
    for (var i = 0; i < offsetWords.length; i++) {
      const offword = offsetWords[i];
      const word = stands[offword[0]];
      if (!word || word.length < offword[1].length) {
        stands[offword[0]] = offword[1];
      }
    }
    const offsets = Object.keys(stands)
      .map(key => {
        return parseInt(key);
      })
      .sort((a, b) => {
        return a - b;
      });
    return offsets.map(off => {
      return [off, stands[off]];
    });
  }

  /**
   * 敏感词数组新增词汇
   * @param word string
   */
  public Add(word: string) {
    word = word.trim();
    if (word.length === 0) {
      return;
    }
    this.AddWord(this.root, word);
    this.FallBack(this.root, word);
  }

  /**
   * 拼接字符串
   * @param node WordTreeNode
   */
  private Collect(node: WordTreeNode) {
    const word = [];
    while (node.val !== null) {
      word.unshift(node.val);
      node = node.parent;
    }
    return word.join("");
  }

  private Locate(word: string) {
    let current = this.root.next[word[0]];
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      current = current.next[char];
      if (current === null) {
        break;
      }
    }
    return current;
  }

  /**
   * 命中次数
   * @param content string
   * @param options {quick:boolean,longest: boolean}
   */
  public Hits(content: string, options = { quick: false, longest: false }) {
    const offWords = this.Search(content, options);
    const seen = {};
    for (let i = 0; i < offWords.length; i++) {
      const word = offWords[i][1];
      const count = seen[word] || 0;
      seen[word] = count + 1;
    }
    return seen;
  }

  /**
   * 检索内容中的敏感词
   * @param content string　需要检索的字符串
   * @param options {quick:boolean,longest: boolean}
   */
  public Search(content: string, options = { quick: false, longest: false }) {
    const offWords = [];
    var current = this.root;
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      let next = current.next[char];
      if (!next) {
        let back = current.back;
        while (back !== null) {
          next = back.next[char];
          if (next) {
            break;
          }
          back = back.back;
        }
      }
      if (next) {
        let back = next;
        do {
          if (back.accept) {
            const word = this.Collect(back);
            offWords.push([i - word.length + 1, word]);
            if (options.quick) {
              return offWords;
            }
          }
          back = back.back;
        } while (back !== this.root);
        current = next;
        continue;
      }
      current = this.root;
    }
    if (options.longest) {
      return this.selectLongest(offWords);
    }
    return offWords;
  }
}
